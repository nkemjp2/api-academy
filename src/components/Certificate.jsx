import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import LESSONS from '../data/lessons.js';
import styles from './Certificate.module.css';

function generateVerificationCode(name, date, score) {
  const raw = `${name}|${date}|${score}`;
  const encoded = btoa(raw);
  return encoded.replace(/[^A-Za-z0-9]/g, '').slice(0, 12).toUpperCase();
}

export default function Certificate({ progress, onClose }) {
  const [name, setName] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const handleDownload = () => {
    if (!name.trim()) return;
    setGenerating(true);

    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const w = doc.internal.pageSize.getWidth();   // 297
      const h = doc.internal.pageSize.getHeight();   // 210
      const cx = w / 2;

      // Background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, w, h, 'F');

      // Gradient accent bar at top
      const barSteps = 60;
      const barH = 4;
      for (let i = 0; i < barSteps; i++) {
        const t = i / barSteps;
        const r = Math.round(6 + (17 - 6) * t);
        const g = Math.round(214 + (138 - 214) * t);
        const b = Math.round(160 + (178 - 160) * t);
        doc.setFillColor(r, g, b);
        doc.rect((w / barSteps) * i, 0, (w / barSteps) + 0.5, barH, 'F');
      }

      // Border frame
      doc.setDrawColor(6, 214, 160);
      doc.setLineWidth(0.5);
      doc.roundedRect(12, 12, w - 24, h - 24, 4, 4, 'S');

      // Inner accent line
      doc.setDrawColor(17, 138, 178);
      doc.setLineWidth(0.2);
      doc.roundedRect(16, 16, w - 32, h - 32, 3, 3, 'S');

      // Title
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(6, 214, 160);
      doc.text('CERTIFICATE OF COMPLETION', cx, 42, { align: 'center' });

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(126, 232, 250);
      doc.text('API Academy \u2014 Python \u00B7 Flask \u00B7 MySQL', cx, 52, { align: 'center' });

      // Decorative line
      doc.setDrawColor(6, 214, 160);
      doc.setLineWidth(0.3);
      doc.line(cx - 50, 58, cx + 50, 58);

      // "This certifies that"
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('This certifies that', cx, 72, { align: 'center' });

      // Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text(name.trim(), cx, 88, { align: 'center' });

      // "has successfully completed"
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('has successfully completed the API Academy curriculum', cx, 100, { align: 'center' });

      // Stats box
      const statsY = 114;
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(cx - 70, statsY - 6, 140, 20, 3, 3, 'F');

      doc.setFontSize(9);
      doc.setTextColor(6, 214, 160);
      doc.text(`${completedCount}/${totalLessons} Lessons`, cx - 50, statsY + 4, { align: 'center' });

      doc.setTextColor(126, 232, 250);
      doc.text('|', cx, statsY + 4, { align: 'center' });

      doc.setTextColor(6, 214, 160);
      doc.text(`${accuracy}% Quiz Accuracy`, cx + 50, statsY + 4, { align: 'center' });

      // Date
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Completed on ${completionDate}`, cx, 146, { align: 'center' });

      // Verification code
      const verCode = generateVerificationCode(name.trim(), completionDate, accuracy);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Verification: ${verCode}`, cx, 158, { align: 'center' });

      // Bottom gradient bar
      for (let i = 0; i < barSteps; i++) {
        const t = i / barSteps;
        const r = Math.round(6 + (17 - 6) * t);
        const g = Math.round(214 + (138 - 214) * t);
        const b = Math.round(160 + (178 - 160) * t);
        doc.setFillColor(r, g, b);
        doc.rect((w / barSteps) * i, h - barH, (w / barSteps) + 0.5, barH, 'F');
      }

      doc.save(`API-Academy-Certificate-${name.trim().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Certificate of Completion</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close certificate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Preview */}
        <div className={styles.preview}>
          <div className={styles.previewBar} />
          <div className={styles.previewInner}>
            <div className={styles.previewLabel}>CERTIFICATE OF COMPLETION</div>
            <div className={styles.previewSub}>API Academy — Python · Flask · MySQL</div>
            <div className={styles.previewDivider} />
            <div className={styles.previewSmall}>This certifies that</div>
            <div className={styles.previewName}>{name.trim() || 'Your Name'}</div>
            <div className={styles.previewSmall}>has successfully completed the API Academy curriculum</div>
            <div className={styles.previewStats}>
              {completedCount}/{totalLessons} Lessons · {accuracy}% Quiz Accuracy
            </div>
            <div className={styles.previewDate}>{completionDate}</div>
          </div>
          <div className={styles.previewBar} />
        </div>

        {/* Form */}
        <div className={styles.form}>
          <label className={styles.label} htmlFor="cert-name">Your full name</label>
          <input
            id="cert-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name as it should appear on the certificate"
            className={styles.input}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleDownload(); }}
          />
          <button
            onClick={handleDownload}
            disabled={!name.trim() || generating}
            className={styles.downloadBtn}
          >
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
