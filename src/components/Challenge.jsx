import React, { useState, useEffect, useRef } from 'react';
import styles from './Challenge.module.css';
import newLinkify from '../linkify-it.js';

// Hoist linkify instance to module scope (assumes newLinkify is stateless)
const linkify = newLinkify();


function isSafeUrl(url) {
  try {
    const u = new URL(url, 'http://dummy');
    const allowed = ['http:', 'https:', 'mailto:', 'tel:'];
    return allowed.includes(u.protocol);
  } catch {
    return false;
  }
}

// CopyUrlBtn component declaration
function CopyUrlBtn({ url }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setError(null);
    if (!navigator.clipboard) {
      setError('Clipboard not supported');
      return;
    }
    navigator.clipboard.writeText(url)
      .then(() => {
        setError(null);
        setCopied(true);
        timeoutRef.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        setError('Failed to copy');
      });
  };

  return (
    <button
      type="button"
      className={styles.copyUrlBtn}
      onClick={handleCopy}
      aria-label="Copy URL"
    >
      {copied ? (
        <span className={styles.copiedTooltip}>Copied!</span>
      ) : error ? (
        <span className={styles.copiedTooltip} style={{ color: 'var(--accent-red)' }}>{error}</span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

// StepText component declaration
function StepText({ text }) {
  if (!text) return <React.Fragment />;
  const matches = linkify.match(text);
  if (!matches) return <React.Fragment><span>{text}</span></React.Fragment>;
  const result = [];
  let lastIndex = 0;
  matches.forEach((match) => {
    if (match.index > lastIndex) {
      result.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (isSafeUrl(match.url)) {
      result.push(
        <span key={match.index} className={styles.urlWrapper}>
          <a
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.stepLink}
            onClick={e => e.stopPropagation()}
          >
            {match.text}
          </a>
          <CopyUrlBtn url={match.url} />
        </span>
      );
    } else {
      result.push(<span key={match.index}>{match.text}</span>);
    }
    lastIndex = match.lastIndex;
  });
  if (lastIndex < text.length) {
    result.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
  }
  return <React.Fragment>{result}</React.Fragment>;
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
