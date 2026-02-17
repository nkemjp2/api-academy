import { useEffect } from 'react';
import { ACHIEVEMENT_DEFS } from '../hooks/useProgress.js';
import styles from './Achievements.module.css';

const CATEGORIES = [...new Set(ACHIEVEMENT_DEFS.map(a => a.category))];

export default function Achievements({ achievements, achievementDates, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const earnedSet = new Set(achievements);
  const earned = achievements.length;
  const total = ACHIEVEMENT_DEFS.length;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Achievements</h2>
          <span className={styles.counter}>{earned}/{total}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close achievements">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${total > 0 ? (earned / total) * 100 : 0}%` }} />
        </div>

        {CATEGORIES.map(cat => (
          <div key={cat} className={styles.section}>
            <h3 className={styles.sectionTitle}>{cat}</h3>
            <div className={styles.grid}>
              {ACHIEVEMENT_DEFS.filter(a => a.category === cat).map(a => {
                const unlocked = earnedSet.has(a.id);
                const date = achievementDates[a.id];
                return (
                  <div key={a.id} className={`${styles.card} ${unlocked ? styles.cardUnlocked : styles.cardLocked}`}>
                    <span className={styles.cardIcon}>{unlocked ? a.icon : '\u{1F512}'}</span>
                    <div className={styles.cardName}>{a.name}</div>
                    <div className={styles.cardDesc}>{a.desc}</div>
                    {unlocked && date && (
                      <div className={styles.cardDate}>{new Date(date).toLocaleDateString()}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
