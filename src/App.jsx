import { useState, useRef, useEffect, useCallback } from 'react';
import linkifyFactory from './linkify-it.js';
import LESSONS from './data/lessons.js';
import { useProgress } from './hooks/useProgress.js';
import CodeBlock from './components/CodeBlock.jsx';
import Quiz from './components/Quiz.jsx';
import Challenge from './components/Challenge.jsx';
import Analytics from './components/Analytics.jsx';
import AchievementToast from './components/AchievementToast.jsx';
import Achievements from './components/Achievements.jsx';
import Certificate from './components/Certificate.jsx';
import appStyles from './App.module.css';

/* ── Auto‑link helper ──────────────────────────────────────────── */
// Hoist linkify instance to module scope
const linkify = linkifyFactory();
function Linkify({ text }) {
  if (!text) return null;
  const matches = linkify.match(text);
  if (!matches) return <span>{text}</span>;
  const result = [];
  let lastIndex = 0;
  matches.forEach((match) => {
    if (match.index > lastIndex) {
      result.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
    }
    result.push(
      <a
        key={match.index}
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        className={appStyles.autoLink}
      >
        {match.text}
      </a>
    );
    lastIndex = match.lastIndex;
  });
  if (lastIndex < text.length) {
    result.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
  }
  return result;
}
// Precompute lesson id -> index map for O(1) lookup
const lessonIndexMap = new Map(LESSONS.map((lesson, i) => [lesson.id, i]));

/* ── Markdown‑lite renderer ─────────────────────────────────────── */
function RichText({ text }) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <br key={i} />;
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <p key={i} className={appStyles.richLine}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={j} className={appStyles.bold}>{part.slice(2, -2)}</strong>;
          if (part.startsWith('`') && part.endsWith('`'))
            return <code key={j} className={appStyles.inlineCode}>{part.slice(1, -1)}</code>;
          return <Linkify key={j} text={part} />;
        })}
      </p>
    );
  });
}

/* ── Section type badges ────────────────────────────────────────── */
const TYPE_META = {
  analogy:   { icon: '\u{1F4A1}', label: 'ANALOGY',    color: '#f0a500' },
  realworld: { icon: '\u{1F30D}', label: 'REAL WORLD',  color: '#06d6a0' },
  concept:   { icon: '\u{1F4D8}', label: 'CONCEPT',     color: '#7ee8fa' },
  code:      { icon: '\u2328\uFE0F',  label: 'CODE',       color: '#c084fc' },
  quiz:      { icon: '\u2753', label: 'QUIZ',        color: '#f97316' },
  challenge: { icon: '\u{1F3CB}\uFE0F', label: 'CHALLENGE',  color: '#f97316' },
};

/* ── Single content‑block renderer ──────────────────────────────── */
function ContentBlock({ item, lessonId, progress }) {
  const meta = TYPE_META[item.type] || TYPE_META.concept;

  if (item.type === 'quiz') {
    return (
      <Quiz
        quiz={item}
        lessonId={lessonId}
        savedResult={progress.quizResults[lessonId]}
        onAnswer={(sel, cor) => progress.recordQuiz(lessonId, sel, cor)}
        onReset={(id) => progress.resetQuiz(id)}
        isReview={!!progress.reviewQueue[lessonId]}
      />
    );
  }

  if (item.type === 'challenge') {
    return (
      <Challenge
        challenge={item}
        lessonId={lessonId}
        completed={progress.challengeResults[lessonId]}
        onComplete={progress.recordChallenge}
      />
    );
  }

  return (
    <section className={appStyles.block}>
      <div className={appStyles.blockBadge}>
        <span>{meta.icon}</span>
        <span style={{ color: meta.color }}>{meta.label}</span>
      </div>
      {item.title && <h3 className={appStyles.blockTitle}>{item.title}</h3>}
      <div className={appStyles.blockBody}>
        <RichText text={item.text} />
      </div>
      {item.type === 'code' && <CodeBlock code={item.code} language={item.language} interactive={item.interactive} />}
      {item.explanation && (
        <div className={appStyles.explanation} style={{ borderLeftColor: meta.color }}>
          <RichText text={item.explanation} />
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════════════ */
export default function App() {
  const progress = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('api-academy-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('api-academy-fontsize') || 'medium';
  });
  const [shareCopied, setShareCopied] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const mainRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('api-academy-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
    localStorage.setItem('api-academy-fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const lesson = LESSONS[progress.currentLesson];
  const modules = [...new Set(LESSONS.map(l => l.module))];

  const goTo = useCallback((idx) => {
    progress.setCurrentLesson(idx);
    setSidebarOpen(false);
    setSearchQuery('');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [progress]);

  const next = useCallback(() => {
    progress.completeLesson(progress.currentLesson);
    if (progress.currentLesson < LESSONS.length - 1) goTo(progress.currentLesson + 1);
  }, [progress, goTo]);

  const prev = useCallback(() => {
    if (progress.currentLesson > 0) goTo(progress.currentLesson - 1);
  }, [progress, goTo]);

  const goToReview = useCallback((lessonId) => {
    const idx = LESSONS.findIndex(l => l.id === lessonId);
    if (idx === -1) return;
    progress.resetQuiz(lessonId);
    goTo(idx);
  }, [progress, goTo]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'n') next();
      if (e.key === 'ArrowLeft' || e.key === 'p') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  /* Scroll progress */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    setScrollProgress(0);
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [progress.currentLesson]);

  const pctComplete = Math.round((progress.completedLessons.length / LESSONS.length) * 100);

  return (
    <div className={appStyles.shell}>
      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <header className={appStyles.mobileBar}>
        <button onClick={() => setSidebarOpen(o => !o)} className={appStyles.menuBtn} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <span className={appStyles.mobileTitle}>API Academy</span>
        <span className={appStyles.mobilePill}>{progress.currentLesson + 1}/{LESSONS.length}</span>
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={appStyles.themeToggle} aria-label="Toggle theme">
          {theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}
        </button>
      </header>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={`${appStyles.sidebar} ${sidebarOpen ? appStyles.sidebarOpen : ''}`}>
        <div className={appStyles.sidebarHead}>
          <div className={appStyles.logoRow}>
            <div className={appStyles.logoIcon}>A</div>
            <div>
              <div className={appStyles.logoName}>API Academy</div>
              <div className={appStyles.logoSub}>Python · Flask · MySQL</div>
            </div>
          </div>

          {/* Progress */}
          <div className={appStyles.progressTrack}>
            <div className={appStyles.progressFill} style={{ width: `${pctComplete}%` }} />
          </div>
          <div className={appStyles.progressMeta}>
            <span>{progress.completedLessons.length}/{LESSONS.length} lessons</span>
            <span className={appStyles.quizScore}>{progress.totalCorrect}/{progress.totalAnswered} quiz</span>
          </div>
          <div className={appStyles.streakRow}>
            {progress.streakData.currentStreak > 0 && (
              <span className={appStyles.streakBadge}>{'\u{1F525}'} {progress.streakData.currentStreak} day streak</span>
            )}
            <button
              onClick={() => setShowAchievements(true)}
              className={appStyles.trophyBtn}
              title="View achievements"
            >
              {'\u{1F3C6}'} {progress.achievements.length}
            </button>
          </div>
        </div>

        {/* ── Search ─────────────────────────────────────────── */}
        <div className={appStyles.searchWrapper}>
          <div className={appStyles.searchInner}>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search lessons…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={appStyles.searchInput}
            />
            {searchQuery ? (
              <button
                className={appStyles.searchClear}
                onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ) : (
              <span className={appStyles.searchHint}>{navigator.platform?.includes('Mac') ? '\u2318K' : 'Ctrl K'}</span>
            )}
          </div>
        </div>

        <nav className={appStyles.nav} role="navigation" aria-label="Lessons">
          {(() => {
            const q = searchQuery.toLowerCase().trim();
            const filtered = q
              ? LESSONS.map((l, idx) => ({ lesson: l, idx })).filter(({ lesson }) =>
                  lesson.title.toLowerCase().includes(q) || lesson.module.toLowerCase().includes(q)
                )
              : null;

            if (filtered && filtered.length === 0) {
              return <div className={appStyles.noResults}>No lessons found</div>;
            }

            if (filtered) {
              return filtered.map(({ lesson: l, idx }) => {
                const active = idx === progress.currentLesson;
                const done = progress.completedSet.has(idx);
                return (
                  <button
                    key={l.id}
                    onClick={() => goTo(idx)}
                    className={`${appStyles.navItem} ${active ? appStyles.navActive : ''} ${done ? appStyles.navDone : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={appStyles.navIcon}>{done ? '\u2705' : l.icon}</span>
                    <span className={appStyles.navText}>{l.title}</span>
                  </button>
                );
              });
            }

            const reviewSection = progress.dueReviews.length > 0 && (
              <div className={appStyles.navGroup}>
                <div className={`${appStyles.navGroupLabel} ${appStyles.navGroupReview}`}>
                  {'\u{1F4DD}'} Review ({progress.dueReviews.length})
                </div>
                {progress.dueReviews.map(lessonId => {
                  const idx = LESSONS.findIndex(l => l.id === lessonId);
                  if (idx === -1) return null;
                  const l = LESSONS[idx];
                  const active = idx === progress.currentLesson;
                  return (
                    <button
                      key={`review-${l.id}`}
                      onClick={() => goToReview(lessonId)}
                      className={`${appStyles.navItem} ${active ? appStyles.navActive : ''} ${appStyles.navReview}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={appStyles.navIcon}>{'\u{1F4DD}'}</span>
                      <span className={appStyles.navText}>{l.title}</span>
                    </button>
                  );
                })}
              </div>
            );

            return (<>
              {reviewSection}
              {modules.map(mod => (
                <div key={mod} className={appStyles.navGroup}>
                  <div className={appStyles.navGroupLabel}>{mod}</div>
                  {LESSONS.filter(l => l.module === mod).map(l => {
                    const idx = lessonIndexMap.get(l.id);
                    const active = idx === progress.currentLesson;
                    const done = progress.completedSet.has(idx);
                    return (
                      <button
                        key={l.id}
                        onClick={() => goTo(idx)}
                        className={`${appStyles.navItem} ${active ? appStyles.navActive : ''} ${done ? appStyles.navDone : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className={appStyles.navIcon}>{done ? '\u2705' : l.icon}</span>
                        <span className={appStyles.navText}>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </>);
          })()}
        </nav>

        <div className={appStyles.sidebarFoot}>
          <div className={appStyles.footActions}>
            <button onClick={progress.exportProgress} className={appStyles.footBtn} title="Download progress as JSON">
              Export
            </button>
            <button onClick={progress.importProgress} className={appStyles.footBtn} title="Restore progress from JSON file">
              Import
            </button>
            <button
              onClick={() => {
                progress.shareProgress().then(() => {
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                });
              }}
              className={appStyles.footBtn}
              title="Copy a shareable link with your progress"
            >
              {shareCopied ? 'Link copied!' : 'Share'}
            </button>
          </div>
          <div className={appStyles.footActions}>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={appStyles.themeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? '\u2600\uFE0F Light' : '\u{1F319} Dark'}
            </button>
            <button
              onClick={() => { progress.flushTime(); setShowAnalytics(true); }}
              className={appStyles.footBtn}
              title="View learning analytics"
            >
              Analytics
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className={appStyles.footBtn}
              disabled={progress.completedLessons.length < LESSONS.length}
              title={progress.completedLessons.length < LESSONS.length ? 'Complete all lessons to unlock' : 'Get your certificate'}
            >
              Certificate
            </button>
          </div>
          <div className={appStyles.fontSizeToggle}>
            <span className={appStyles.fontSizeLabel}>Text</span>
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`${appStyles.fontSizeBtn} ${fontSize === size ? appStyles.fontSizeBtnActive : ''}`}
                aria-label={`${size} font size`}
                aria-pressed={fontSize === size}
              >
                {size[0].toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={progress.resetAll} className={appStyles.resetBtn}>Reset progress</button>
          <span className={appStyles.kbdHint}>← → or N/P to navigate</span>
        </div>
      </aside>

      {/* ── Overlay ─────────────────────────────────────────────── */}
      {sidebarOpen && <div className={appStyles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ── Main content ────────────────────────────────────────── */}
      <main ref={mainRef} className={appStyles.main} role="main">
        <div className={appStyles.scrollProgress}>
          <div className={appStyles.scrollProgressFill} style={{ width: `${scrollProgress}%` }} />
        </div>
        {!isOnline && (
          <div className={appStyles.offlineBanner}>
            You're offline — lessons are still available
          </div>
        )}
        {progress.completedLessons.length === LESSONS.length && (
          <div className={appStyles.congratsBanner}>
            <span>{'\u{1F389}'} You've completed all lessons!</span>
            <button onClick={() => setShowCertificate(true)} className={appStyles.certBannerBtn}>
              Get Certificate
            </button>
          </div>
        )}
        <div className={appStyles.lessonHeader}>
          <div className={appStyles.lessonMeta}>
            <span>Lesson {progress.currentLesson + 1} · {lesson.module}</span>
            {lesson.readingTime && <span className={appStyles.readTime}>{lesson.readingTime} min read</span>}
          </div>
          <h1 className={appStyles.lessonTitle}>
            <span className={appStyles.lessonIcon}>{lesson.icon}</span>
            {lesson.title}
          </h1>
        </div>

        <div className={appStyles.content}>
          {lesson.content.map((item, i) => (
            <ContentBlock key={`${lesson.id}-${i}`} item={item} lessonId={lesson.id} progress={progress} />
          ))}

          {/* Navigation buttons */}
          <div className={appStyles.navButtons}>
            <button onClick={prev} disabled={progress.currentLesson === 0} className={appStyles.btnPrev}>
              ← Previous
            </button>
            <button onClick={next} className={appStyles.btnNext}>
              {progress.currentLesson === LESSONS.length - 1 ? '\u{1F393} Complete Course' : 'Next Lesson →'}
            </button>
          </div>
        </div>
      </main>

      {/* ── Analytics modal ───────────────────────────────────────── */}
      {showAnalytics && (
        <Analytics progress={progress} onClose={() => setShowAnalytics(false)} />
      )}

      {/* ── Achievements modal ─────────────────────────────────────── */}
      {showAchievements && (
        <Achievements
          achievements={progress.achievements}
          achievementDates={progress.achievementDates}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* ── Certificate modal ──────────────────────────────────────── */}
      {showCertificate && (
        <Certificate progress={progress} onClose={() => setShowCertificate(false)} />
      )}

      {/* ── Achievement toasts ─────────────────────────────────────── */}
      <AchievementToast
        pendingIds={progress.pendingToasts}
        onDismiss={progress.dismissAchievements}
      />
    </div>
  );
}
