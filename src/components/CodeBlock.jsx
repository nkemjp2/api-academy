import { useState, useMemo } from 'react';
import { highlight } from '../highlight.js';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => highlight(code, language), [code, language]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button onClick={handleCopy} className={styles.copyBtn} aria-label="Copy code">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code>
          {tokens.map((token, i) => (
            token.className
              ? <span key={i} className={token.className}>{token.text}</span>
              : <span key={i}>{token.text}</span>
          ))}
        </code>
      </pre>
    </div>
  );
}
