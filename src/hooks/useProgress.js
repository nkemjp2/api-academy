import { useState, useEffect, useCallback, useRef } from 'react';
import LESSONS from '../data/lessons.js';

const STORAGE_KEY = 'api-academy-progress';

const MAX_SESSION_SECONDS = 1800; // 30 minutes cap per session

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(streakData) {
  const today = todayStr();
  if (streakData.lastActiveDate === today) return streakData;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const newCurrent = streakData.lastActiveDate === yesterdayStr
    ? streakData.currentStreak + 1
    : 1;
  return {
    currentStreak: newCurrent,
    longestStreak: Math.max(streakData.longestStreak, newCurrent),
    lastActiveDate: today,
  };
}

function addDailyActivity(daily, key, amount) {
  const today = todayStr();
  const entry = daily[today] || { lessonsCompleted: 0, quizzesTaken: 0, timeSpent: 0 };
  return { ...daily, [today]: { ...entry, [key]: entry[key] + amount } };
}

const defaultState = {
  currentLesson: 0,
  completedLessons: [],
  quizResults: {},     // { lessonId: { answered: true, correct: true, selectedIndex: 1 } }
  challengeResults: {},// { lessonId: true/false }
  reviewQueue: {},     // { lessonId: { nextReview: ISO, interval: days, easeFactor: number, repetitions: number } }
  lessonTimeSpent: {}, // { [lessonIndex]: totalSeconds }
  dailyActivity: {},   // { 'YYYY-MM-DD': { lessonsCompleted, quizzesTaken, timeSpent } }
  streakData: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
  totalCorrect: 0,
  totalAnswered: 0,
  lastVisited: null,
  achievements: [],        // earned achievement IDs
  achievementsSeen: [],    // IDs the user has already dismissed from toast
  achievementDates: {},    // { achievementId: ISO date string }
  consecutiveCorrectQuizzes: 0,
};

/* ── Achievement definitions ─────────────────────────────────── */
const MODULE_NAMES = [...new Set(LESSONS.map(l => l.module))];
const MODULE_INDICES = {};
MODULE_NAMES.forEach(mod => {
  MODULE_INDICES[mod] = LESSONS
    .map((l, i) => l.module === mod ? i : -1)
    .filter(i => i !== -1);
});

const QUIZ_LESSON_IDS = LESSONS.filter(l => l.content.some(c => c.type === 'quiz')).map(l => l.id);
const CHALLENGE_LESSON_IDS = LESSONS.filter(l => l.content.some(c => c.type === 'challenge')).map(l => l.id);

export const ACHIEVEMENT_DEFS = [
  { id: 'first-steps',        icon: '\u{1F476}', name: 'First Steps',        desc: 'Complete your first lesson',                    category: 'Progress' },
  { id: 'module-setup',       icon: '\u{1F527}', name: 'Setup Complete',     desc: 'Complete all Setup lessons',                    category: 'Modules' },
  { id: 'module-foundation',  icon: '\u{1F9F1}', name: 'Foundation Built',   desc: 'Complete all Foundation lessons',               category: 'Modules' },
  { id: 'module-database',    icon: '\u{1F5C4}\uFE0F', name: 'Data Master',       desc: 'Complete all Database lessons',                 category: 'Modules' },
  { id: 'module-production',  icon: '\u{1F680}', name: 'Production Ready',   desc: 'Complete all Production lessons',               category: 'Modules' },
  { id: 'module-capstone',    icon: '\u{1F3D7}\uFE0F', name: 'Capstone Hero',     desc: 'Complete all Capstone lessons',                 category: 'Modules' },
  { id: 'perfect-quiz',       icon: '\u{1F3AF}', name: 'Sharp Shooter',      desc: 'Get a quiz right on first attempt',             category: 'Quizzes' },
  { id: 'quiz-streak-5',      icon: '\u{1F525}', name: 'On Fire',            desc: 'Get 5 quizzes correct in a row',                category: 'Quizzes' },
  { id: 'scholar',            icon: '\u{1F393}', name: 'Scholar',            desc: 'Get every quiz correct',                        category: 'Quizzes' },
  { id: 'streak-3',           icon: '\u26A1',    name: '3-Day Streak',       desc: 'Learn for 3 days in a row',                     category: 'Streaks' },
  { id: 'streak-7',           icon: '\u{1F4AA}', name: 'Week Warrior',       desc: 'Learn for 7 days in a row',                     category: 'Streaks' },
  { id: 'streak-30',          icon: '\u{1F451}', name: 'Monthly Master',     desc: 'Learn for 30 days in a row',                    category: 'Streaks' },
  { id: 'completionist',      icon: '\u{1F31F}', name: 'Completionist',      desc: 'Complete all lessons',                          category: 'Progress' },
  { id: 'all-challenges',     icon: '\u{1F3CB}\uFE0F', name: 'Challenge Champion', desc: 'Complete all challenges',                       category: 'Progress' },
];

function checkAchievements(state) {
  const earned = new Set(state.achievements);
  const completedSet = new Set(state.completedLessons);

  // First Steps — complete at least 1 lesson
  if (state.completedLessons.length >= 1) earned.add('first-steps');

  // Module completions
  const moduleMap = { 'Setup': 'module-setup', 'Foundation': 'module-foundation', 'Database': 'module-database', 'Production': 'module-production', 'Capstone': 'module-capstone' };
  for (const [mod, achId] of Object.entries(moduleMap)) {
    const indices = MODULE_INDICES[mod];
    if (indices && indices.every(i => completedSet.has(i))) earned.add(achId);
  }

  // Perfect quiz — at least one quiz answered correctly
  if (Object.values(state.quizResults).some(r => r.correct)) earned.add('perfect-quiz');

  // Quiz streak 5
  if (state.consecutiveCorrectQuizzes >= 5) earned.add('quiz-streak-5');

  // Scholar — every quiz lesson answered correctly
  if (QUIZ_LESSON_IDS.length > 0 && QUIZ_LESSON_IDS.every(id => state.quizResults[id]?.correct)) earned.add('scholar');

  // Streaks
  const streak = state.streakData.longestStreak;
  if (streak >= 3) earned.add('streak-3');
  if (streak >= 7) earned.add('streak-7');
  if (streak >= 30) earned.add('streak-30');

  // Completionist
  if (state.completedLessons.length >= LESSONS.length) earned.add('completionist');

  // All challenges
  if (CHALLENGE_LESSON_IDS.length > 0 && CHALLENGE_LESSON_IDS.every(id => state.challengeResults[id] === true)) earned.add('all-challenges');

  return [...earned];
}

function withAchievements(state) {
  const newAchievements = checkAchievements(state);
  if (newAchievements.length === state.achievements.length) return state;
  const newIds = newAchievements.filter(id => !state.achievements.includes(id));
  if (newIds.length === 0) return state;
  const now = new Date().toISOString();
  const newDates = { ...state.achievementDates };
  newIds.forEach(id => { newDates[id] = now; });
  return { ...state, achievements: newAchievements, achievementDates: newDates };
}

function loadFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('progress');
    if (!encoded) return null;
    const json = atob(decodeURIComponent(encoded));
    const data = JSON.parse(json);
    if (typeof data.currentLesson !== 'number' || !Array.isArray(data.completedLessons)) return null;
    // Clean the URL so it doesn't re-trigger on refresh
    const url = new URL(window.location);
    url.searchParams.delete('progress');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    return { ...defaultState, ...data };
  } catch (e) {
    return null;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    // Check URL first for shared progress
    const fromUrl = loadFromUrl();
    if (fromUrl) return fromUrl;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      // localStorage unavailable or corrupted
    }
    return defaultState;
  });

  const lessonStartRef = useRef(Date.now());

  // Flush time for the current lesson into state
  const flushTime = useCallback(() => {
    const elapsed = Math.min(
      Math.round((Date.now() - lessonStartRef.current) / 1000),
      MAX_SESSION_SECONDS
    );
    if (elapsed < 1) return;
    setProgress(prev => {
      const prevTime = prev.lessonTimeSpent[prev.currentLesson] || 0;
      return {
        ...prev,
        lessonTimeSpent: { ...prev.lessonTimeSpent, [prev.currentLesson]: prevTime + elapsed },
        dailyActivity: addDailyActivity(prev.dailyActivity, 'timeSpent', elapsed),
        streakData: updateStreak(prev.streakData),
      };
    });
    lessonStartRef.current = Date.now();
  }, []);

  // Flush time on page unload
  useEffect(() => {
    const onUnload = () => flushTime();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [flushTime]);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...progress,
        lastVisited: new Date().toISOString(),
      }));
    } catch (e) {
      // Silently fail if localStorage is full/unavailable
    }
  }, [progress]);

  const setCurrentLesson = useCallback((index) => {
    flushTime();
    lessonStartRef.current = Date.now();
    setProgress(prev => ({ ...prev, currentLesson: index }));
  }, [flushTime]);

  const completeLesson = useCallback((index) => {
    setProgress(prev => {
      const completed = new Set(prev.completedLessons);
      const isNew = !completed.has(index);
      completed.add(index);
      const next = {
        ...prev,
        completedLessons: [...completed],
        dailyActivity: isNew ? addDailyActivity(prev.dailyActivity, 'lessonsCompleted', 1) : prev.dailyActivity,
        streakData: updateStreak(prev.streakData),
      };
      return withAchievements(next);
    });
  }, []);

  const recordQuiz = useCallback((lessonId, selectedIndex, correctIndex) => {
    setProgress(prev => {
      // Don't re-record if already answered for this lesson
      if (prev.quizResults[lessonId]) return prev;
      const isCorrect = selectedIndex === correctIndex;
      const existingReview = prev.reviewQueue[lessonId];
      const newReviewQueue = { ...prev.reviewQueue };

      if (!isCorrect) {
        // Wrong answer — schedule for review
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (existingReview) {
          newReviewQueue[lessonId] = {
            ...existingReview,
            nextReview: tomorrow.toISOString(),
            interval: 1,
            easeFactor: Math.max(1.3, existingReview.easeFactor - 0.2),
          };
        } else {
          newReviewQueue[lessonId] = {
            nextReview: tomorrow.toISOString(),
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
          };
        }
      } else if (existingReview) {
        // Correct answer on a review — advance the schedule
        const newReps = existingReview.repetitions + 1;
        if (newReps >= 4) {
          delete newReviewQueue[lessonId];
        } else {
          const newInterval = Math.round(existingReview.interval * existingReview.easeFactor);
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + newInterval);
          newReviewQueue[lessonId] = {
            ...existingReview,
            nextReview: nextDate.toISOString(),
            interval: newInterval,
            repetitions: newReps,
          };
        }
      }

      const next = {
        ...prev,
        quizResults: {
          ...prev.quizResults,
          [lessonId]: { answered: true, correct: isCorrect, selectedIndex },
        },
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
        reviewQueue: newReviewQueue,
        dailyActivity: addDailyActivity(prev.dailyActivity, 'quizzesTaken', 1),
        streakData: updateStreak(prev.streakData),
        consecutiveCorrectQuizzes: isCorrect ? prev.consecutiveCorrectQuizzes + 1 : 0,
      };
      return withAchievements(next);
    });
  }, []);

  const recordChallenge = useCallback((lessonId, completed) => {
    setProgress(prev => {
      const next = {
        ...prev,
        challengeResults: { ...prev.challengeResults, [lessonId]: completed },
      };
      return withAchievements(next);
    });
  }, []);

  const resetQuiz = useCallback((lessonId) => {
    setProgress(prev => {
      const quiz = prev.quizResults[lessonId];
      if (!quiz) return prev;
      const newResults = { ...prev.quizResults };
      delete newResults[lessonId];
      return {
        ...prev,
        quizResults: newResults,
        totalCorrect: prev.totalCorrect - (quiz.correct ? 1 : 0),
        totalAnswered: prev.totalAnswered - 1,
      };
    });
  }, []);

  const dismissAchievements = useCallback((ids) => {
    setProgress(prev => ({
      ...prev,
      achievementsSeen: [...new Set([...prev.achievementsSeen, ...ids])],
    }));
  }, []);

  const resetAll = useCallback(() => {
    setProgress(defaultState);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }, []);

  const exportProgress = useCallback(() => {
    try {
      const data = {
        ...progress,
        lastVisited: new Date().toISOString(),
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export progress:', e);
    }
  }, [progress]);

  const shareProgress = useCallback(async () => {
    const data = {
      currentLesson: progress.currentLesson,
      completedLessons: progress.completedLessons,
      quizResults: progress.quizResults,
      challengeResults: progress.challengeResults,
      totalCorrect: progress.totalCorrect,
      totalAnswered: progress.totalAnswered,
    };
    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}?progress=${encoded}`;
    await navigator.clipboard.writeText(url);
  }, [progress]);

  const importProgress = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (typeof data.currentLesson !== 'number' || !Array.isArray(data.completedLessons)) {
            alert('Invalid progress file. Please select a valid API Academy export.');
            return;
          }
          setProgress({ ...defaultState, ...data });
        } catch (err) {
          alert('Could not read file. Make sure it is a valid JSON export.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const now = new Date();
  const dueReviews = Object.entries(progress.reviewQueue)
    .filter(([, entry]) => new Date(entry.nextReview) <= now)
    .map(([lessonId]) => lessonId);

  const pendingToasts = progress.achievements.filter(id => !progress.achievementsSeen.includes(id));

  return {
    ...progress,
    completedSet: new Set(progress.completedLessons),
    dueReviews,
    pendingToasts,
    getReviewCount: () => dueReviews.length,
    setCurrentLesson,
    completeLesson,
    recordQuiz,
    recordChallenge,
    resetQuiz,
    resetAll,
    dismissAchievements,
    flushTime,
    exportProgress,
    importProgress,
    shareProgress,
  };
}
