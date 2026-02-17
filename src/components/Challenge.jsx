import { useState, useEffect } from 'react';
import styles from './Challenge.module.css';

function StepText({ text }) {
  const urlRegex = /(https?:\/\/[^\s,)]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
           className={styles.stepLink} onClick={(e) => e.stopPropagation()}>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Challenge({ challenge, lessonId, completed, onComplete }) {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(`challenge-${lessonId}`);
      return saved ? JSON.parse(saved) : new Array(challenge.steps.length).fill(false);
    } catch {
      return new Array(challenge.steps.length).fill(false);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`challenge-${lessonId}`, JSON.stringify(checked));
    } catch {}
    const allDone = checked.every(Boolean);
    if (allDone && !completed) onComplete(lessonId, true);
  }, [checked]);

  const toggle = (i) => {
    setChecked(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const doneCount = checked.filter(Boolean).length;
  const allDone = doneCount === challenge.steps.length;

  return (
    <div className={`${styles.card} ${allDone ? styles.cardDone : ''}`}>
      <div className={styles.header}>
        <div className={styles.badge}>
          {allDone ? '✅ COMPLETED' : '🏋️ HANDS-ON CHALLENGE'}
        </div>
        <span className={styles.counter}>{doneCount}/{challenge.steps.length}</span>
      </div>

      <h3 className={styles.title}>{challenge.title}</h3>
      <p className={styles.desc}>{challenge.description}</p>

      <div className={styles.steps}>
        {challenge.steps.map((step, i) => (
          <label key={i} className={`${styles.step} ${checked[i] ? styles.stepDone : ''}`}>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggle(i)}
              className={styles.checkbox}
            />
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepText}><StepText text={step} /></span>
          </label>
        ))}
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${(doneCount / challenge.steps.length) * 100}%` }} />
      </div>
    </div>
  );
}
