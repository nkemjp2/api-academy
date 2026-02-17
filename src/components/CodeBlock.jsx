import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { highlight } from '../highlight.js';
import { usePyodide } from '../hooks/usePyodide.js';
import RouteSimulator from './RouteSimulator.jsx';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ code, language, interactive = false }) {
  const [copied, setCopied] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const preRef = useRef(null);
  const textareaRef = useRef(null);

  const { runPython, isLoading } = usePyodide();

  const isInteractive = interactive && language === 'python';
  const hasFlaskRoutes = language === 'python' && /@app\.route\(/.test(code);

  const displayCode = isInteractive ? editableCode : code;
  const tokens = useMemo(() => highlight(displayCode, language), [displayCode, language]);
  const lines = useMemo(() => displayCode.split('\n'), [displayCode]);

  const checkOverflow = useCallback(() => {
    const el = preRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setShowFade(hasOverflow && !atEnd);
  }, []);

  useEffect(() => {
    const el = preRef.current;
    if (!el) return;
    checkOverflow();
    el.addEventListener('scroll', checkOverflow);
    window.addEventListener('resize', checkOverflow);
    return () => {
      el.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [checkOverflow]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    const result = await runPython(editableCode);
    setOutput(result);
    setRunning(false);
  };

  const handleReset = () => {
    setEditableCode(code);
    setOutput(null);
  };

  const handleTextareaInput = (e) => {
    setEditableCode(e.target.value);
  };

  // Sync textarea scroll with pre
  const handleTextareaScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      setEditableCode(val.substring(0, start) + '    ' + val.substring(end));
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  const hasChanged = isInteractive && editableCode !== code;
  const loadingLabel = isLoading ? 'Loading Python runtime...' : running ? 'Running...' : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.language}>
          {language}
          {isInteractive && <span className={styles.interactiveBadge}>Interactive</span>}
        </span>
        <div className={styles.headerActions}>
          {hasFlaskRoutes && (
            <button
              onClick={() => setShowSimulator(s => !s)}
              className={`${styles.tryItBtn} ${showSimulator ? styles.tryItActive : ''}`}
              aria-label="Toggle route simulator"
            >
              {showSimulator ? '\u2715 Close' : '\u{1F9EA} Try it'}
            </button>
          )}
          {isInteractive && hasChanged && (
            <button onClick={handleReset} className={styles.resetBtn} aria-label="Reset code">
              Reset
            </button>
          )}
          {isInteractive && (
            <button
              onClick={handleRun}
              disabled={running || isLoading}
              className={styles.runBtn}
              aria-label="Run code"
            >
              {loadingLabel || '\u25B6 Run'}
            </button>
          )}
          <button onClick={handleCopy} className={styles.copyBtn} aria-label="Copy code">
            {copied ? '\u2713 Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className={styles.preWrapper}>
        <div className={styles.lineNumbers} aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className={styles.codeArea}>
          <pre className={styles.pre} ref={preRef}>
            <code>
              {tokens.map((token, i) => (
                token.className
                  ? <span key={i} className={token.className}>{token.text}</span>
                  : <span key={i}>{token.text}</span>
              ))}
            </code>
          </pre>
          {isInteractive && (
            <textarea
              ref={textareaRef}
              className={styles.editable}
              value={editableCode}
              onChange={handleTextareaInput}
              onScroll={handleTextareaScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          )}
        </div>
        {showFade && !isInteractive && <div className={styles.scrollFade} />}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loading}>
          <span className={styles.loadingDot} />
          Loading Python runtime...
        </div>
      )}

      {/* Output panel */}
      {output && (
        <div className={styles.output}>
          {output.stdout && <pre className={styles.stdout}>{output.stdout}</pre>}
          {output.stderr && <pre className={styles.stderr}>{output.stderr}</pre>}
          {!output.stdout && !output.stderr && <pre className={styles.stdout}>(no output)</pre>}
        </div>
      )}

      {/* Route simulator */}
      {showSimulator && hasFlaskRoutes && <RouteSimulator code={code} />}
    </div>
  );
}
