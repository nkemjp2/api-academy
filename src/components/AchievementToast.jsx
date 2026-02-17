import { useEffect, useState } from 'react';
import { ACHIEVEMENT_DEFS } from '../hooks/useProgress.js';
import styles from './AchievementToast.module.css';

export default function AchievementToast({ pendingIds, onDismiss }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (pendingIds.length === 0) return;
    // Show new toasts that aren't already visible
    setVisible(prev => {
      const existing = new Set(prev.map(v => v.id));
      const newOnes = pendingIds
        .filter(id => !existing.has(id))
        .map(id => ({ id, entering: true }));
      return [...prev, ...newOnes];
    });
  }, [pendingIds]);

  useEffect(() => {
    if (visible.length === 0) return;
    const timer = setTimeout(() => {
      // Remove the oldest toast
      setVisible(prev => {
        if (prev.length === 0) return prev;
        const dismissed = prev[0];
        onDismiss([dismissed.id]);
        return prev.slice(1);
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (visible.length === 0) return null;

  return (
    <div className={styles.container}>
      {visible.slice(0, 3).map((item) => {
        const def = ACHIEVEMENT_DEFS.find(a => a.id === item.id);
        if (!def) return null;
        return (
          <div key={item.id} className={styles.toast}>
            <span className={styles.icon}>{def.icon}</span>
            <div className={styles.body}>
              <div className={styles.label}>Achievement Unlocked!</div>
              <div className={styles.name}>{def.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
