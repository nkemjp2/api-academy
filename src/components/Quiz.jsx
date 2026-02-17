import { useState, useEffect } from 'react';
import styles from './Quiz.module.css';

export default function Quiz({ quiz, lessonId, savedResult, onAnswer, onReset, isReview }) {
  const [selected, setSelected] = useState(savedResult?.selectedIndex ?? null);
  const [answered, setAnswered] = useState(savedResult?.answered ?? false);

  // Sync with saved state
  useEffect(() => {
    if (savedResult) {
      setSelected(savedResult.selectedIndex);
      setAnswered(true);
    }
  }, [savedResult]);

  const handleSelect = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    onAnswer(index, quiz.correct);
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswered(false);
    onReset(lessonId);
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className={styles.card}>
      {isReview && !answered && (
        <div className={styles.reviewBanner}>
          {'\u{1F4DD}'} Review — this question is due for practice
        </div>
      )}
      <div className={styles.badge}>CHECKPOINT</div>
      <p className={styles.question}>{quiz.question}</p>

      <div className={styles.options}>
        {quiz.options.map((option, i) => {
          let optClass = styles.option;
          if (answered && i === quiz.correct) optClass += ' ' + styles.correct;
          else if (answered && i === selected && !isCorrect) optClass += ' ' + styles.wrong;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={optClass}
              disabled={answered}
              aria-label={`Option ${String.fromCharCode(65 + i)}: ${option}`}
            >
              <span className={styles.optionLabel}>{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          <div className={styles.feedbackHeader}>
            <p className={styles.feedbackTitle}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
            </p>
            {!isCorrect && (
              <button onClick={handleRetry} className={styles.retryBtn} aria-label="Try again">
                ↻ Retry
              </button>
            )}
          </div>
          <p className={styles.feedbackText}>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
