import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'api-academy-progress';

const defaultState = {
  currentLesson: 0,
  completedLessons: [],
  quizResults: {},     // { lessonId: { answered: true, correct: true, selectedIndex: 1 } }
  challengeResults: {},// { lessonId: true/false }
  totalCorrect: 0,
  totalAnswered: 0,
  lastVisited: null,
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
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
    setProgress(prev => ({ ...prev, currentLesson: index }));
  }, []);

  const completeLesson = useCallback((index) => {
    setProgress(prev => {
      const completed = new Set(prev.completedLessons);
      completed.add(index);
      return { ...prev, completedLessons: [...completed] };
    });
  }, []);

  const recordQuiz = useCallback((lessonId, selectedIndex, correctIndex) => {
    setProgress(prev => {
      // Don't re-record if already answered for this lesson
      if (prev.quizResults[lessonId]) return prev;
      const isCorrect = selectedIndex === correctIndex;
      return {
        ...prev,
        quizResults: {
          ...prev.quizResults,
          [lessonId]: { answered: true, correct: isCorrect, selectedIndex },
        },
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
      };
    });
  }, []);

  const recordChallenge = useCallback((lessonId, completed) => {
    setProgress(prev => ({
      ...prev,
      challengeResults: { ...prev.challengeResults, [lessonId]: completed },
    }));
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

  return {
    ...progress,
    completedSet: new Set(progress.completedLessons),
    setCurrentLesson,
    completeLesson,
    recordQuiz,
    recordChallenge,
    resetQuiz,
    resetAll,
    exportProgress,
    importProgress,
  };
}
