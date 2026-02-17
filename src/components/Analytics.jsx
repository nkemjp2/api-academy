import { useEffect } from 'react';
import LESSONS from '../data/lessons.js';
import styles from './Analytics.module.css';

function formatTime(seconds) {
  if (!seconds || seconds < 60) return '< 1m';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const MODULES = [...new Set(LESSONS.map(l => l.module))];

export default function Analytics({ progress, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const totalLessons = LESSONS.length;
  const completedSet = new Set(progress.completedLessons);
  const totalTime = Object.values(progress.lessonTimeSpent).reduce((a, b) => a + b, 0);
  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  // ── Quiz accuracy by module ──
  const moduleAccuracy = MODULES.map(mod => {
    const moduleLessons = LESSONS.filter(l => l.module === mod);
    let correct = 0;
    let answered = 0;
    moduleLessons.forEach(l => {
      const result = progress.quizResults[l.id];
      if (result) {
        answered++;
        if (result.correct) correct++;
      }
    });
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : -1;
    return { mod, correct, answered, pct };
  });

  // ── Completion timeline ──
  const timelineData = MODULES.map(mod => {
    const moduleLessons = LESSONS.filter(l => l.module === mod);
    return {
      mod,
      lessons: moduleLessons.map(l => {
        const idx = LESSONS.indexOf(l);
        return { title: l.title, done: completedSet.has(idx), current: idx === progress.currentLesson };
      }),
    };
  });

  // ── Weakest topics ──
  const weakTopics = LESSONS
    .map((l, idx) => {
      const quiz = progress.quizResults[l.id];
      const challenge = progress.challengeResults[l.id];
      let reason = null;
      if (quiz && !quiz.correct) reason = 'Quiz failed';
      else if (challenge === false) reason = 'Challenge incomplete';
      else if (!completedSet.has(idx) && idx < progress.currentLesson) reason = 'Skipped';
      return reason ? { lesson: l, idx, reason } : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  // ── Weekly activity (last 7 days) ──
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activity = progress.dailyActivity[key];
    let level = 0;
    if (activity) {
      const score = activity.lessonsCompleted * 3 + activity.quizzesTaken * 2 + Math.floor(activity.timeSpent / 300);
      if (score >= 8) level = 4;
      else if (score >= 5) level = 3;
      else if (score >= 2) level = 2;
      else level = 1;
    }
    weekDays.push({ key, label: dayNames[d.getDay()], level });
  }

  const levelClass = [null, styles.dayL1, styles.dayL2, styles.dayL3, styles.dayL4];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Learning Analytics</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close analytics">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* ── Summary cards ── */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardValue}>{formatTime(totalTime)}</div>
            <div className={styles.cardLabel}>Time Invested</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardValue}>{progress.completedLessons.length}/{totalLessons}</div>
            <div className={styles.cardLabel}>Lessons Done</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardValue}>{accuracy}%</div>
            <div className={styles.cardLabel}>Quiz Accuracy</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardValue}>{progress.streakData.currentStreak}</div>
            <div className={styles.cardLabel}>Day Streak</div>
          </div>
        </div>

        {/* ── Quiz accuracy by module ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quiz Accuracy by Module</h3>
          <div className={styles.barChart}>
            {moduleAccuracy.map(({ mod, pct, answered }) => (
              <div key={mod} className={styles.barRow}>
                <span className={styles.barLabel}>{mod}</span>
                <div className={styles.barTrack}>
                  {answered > 0 && (
                    <div
                      className={`${styles.barFill} ${pct >= 80 ? styles.barGreen : pct >= 50 ? styles.barAmber : styles.barRed}`}
                      style={{ width: `${pct}%` }}
                    />
                  )}
                </div>
                <span className={styles.barPct}>
                  {answered > 0 ? `${pct}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Completion timeline ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Lesson Completion</h3>
          <div className={styles.timeline}>
            {timelineData.map(({ mod, lessons }) => (
              <div key={mod} className={styles.timelineMod}>
                <span className={styles.timelineModLabel}>{mod}</span>
                <div className={styles.timelineDots}>
                  {lessons.map((l, i) => (
                    <div
                      key={i}
                      className={`${styles.dot} ${l.done ? styles.dotDone : ''} ${l.current ? styles.dotCurrent : ''}`}
                      title={`${l.title}${l.done ? ' (completed)' : l.current ? ' (current)' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Weakest topics ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Areas to Improve</h3>
          {weakTopics.length === 0 ? (
            <div className={styles.emptyState}>No weak areas detected yet. Keep going!</div>
          ) : (
            <div className={styles.weakList}>
              {weakTopics.map(({ lesson, reason }) => (
                <div key={lesson.id} className={styles.weakItem}>
                  <span className={styles.weakIcon}>{lesson.icon}</span>
                  <span className={styles.weakTitle}>{lesson.title}</span>
                  <span className={styles.weakReason}>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Weekly activity ── */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Last 7 Days</h3>
          <div className={styles.weekGrid}>
            {weekDays.map(({ key, label, level }) => (
              <div key={key} className={styles.dayCol}>
                <div className={`${styles.dayBox} ${level > 0 ? levelClass[level] : ''}`} title={key} />
                <span className={styles.dayLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
