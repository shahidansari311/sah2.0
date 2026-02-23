// ─── UPLOAD PAGE ─────────────────────────────────────────────────────────
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { apiAnalyzeResumes } from '../services/api';
import './Upload.css';

const STAGES_TEXT = [
  'Uploading files to FastAPI pipeline...',
  'Running pdfplumber spatial extraction...',
  'Applying heuristic section detection...',
  'Computing section scores & weights...',
  'Running TOPSIS ranking algorithm...',
  'Saving results to PostgreSQL...',
  'Rendering results to dashboard...',
];

export function Upload({ onComplete, onAuthClick, user }) {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleFiles = useCallback((fileList) => {
    if (!user) { onAuthClick('signup'); return; }
    const arr = Array.from(fileList).filter(f =>
      ['pdf', 'docx', 'doc', 'txt', 'odt'].includes(f.name.split('.').pop().toLowerCase())
    );
    if (!arr.length) { setError('Please upload PDF, DOCX, DOC, ODT, or TXT files.'); return; }
    if (arr.length > 25) { setError('Maximum 25 files per batch.'); return; }
    setFiles(arr);
    startAnalysis(arr);
  }, [user]);

  const startAnalysis = async (fileArr) => {
    if (!user) { onAuthClick('signup'); return; }
    setError('');
    setPhase('analyzing');
    setProgress(0);

    // Fake progress animation while API call runs
    let si = 0;
    setStage(STAGES_TEXT[0]);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p; // hold at 90 until real response
        const np = p + Math.random() * 4 + 2;
        const ns = Math.min(Math.floor(np / (90 / (STAGES_TEXT.length - 1))), STAGES_TEXT.length - 2);
        if (ns !== si) { si = ns; setStage(STAGES_TEXT[si]); }
        return np;
      });
    }, 200);

    try {
      const result = await apiAnalyzeResumes(fileArr);
      clearInterval(iv);
      setStage(STAGES_TEXT[STAGES_TEXT.length - 1]);
      setProgress(100);

      // Store the result in sessionStorage so Analysis & Ranking pages can read it
      sessionStorage.setItem('rs_batch', JSON.stringify(result));
      setTimeout(() => {
        setPhase('done');
        onComplete?.(result);
      }, 600);
    } catch (err) {
      clearInterval(iv);
      setPhase('idle');
      setProgress(0);
      setError(err.message || 'Analysis failed. Please try again.');
    }
  };

  const count = files.length || 5;

  return (
    <section id="upload" className="upload-section" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Step 01 — Upload</span>
          <h2 className="section-title">Drop. <span className="grad">Analyze.</span> Rank.</h2>
          <p className="section-sub">Upload up to 25 resumes at once. Our async pipeline handles everything — no waiting, no blocking.</p>
        </motion.div>

        <div className="upload-grid">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>
            <div
              className={`dropzone glass ${phase === 'drag' ? 'dropzone--drag' : ''} ${phase === 'done' ? 'dropzone--done' : ''}`}
              onDragOver={e => { e.preventDefault(); if (phase === 'idle') setPhase('drag'); }}
              onDragLeave={() => phase === 'drag' && setPhase('idle')}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onClick={() => phase === 'idle' && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt,.odt"
                style={{ display: 'none' }}
                onChange={e => handleFiles(e.target.files)}
              />

              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div key="idle" className="dz-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="dz-icon" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>📄</motion.div>
                    <h3>Drop Resumes Here</h3>
                    <p>PDF, DOCX, DOC — up to 25 files per batch</p>
                    <div className="dz-formats">
                      {['PDF', 'DOCX', 'DOC', 'TXT', 'ODT'].map(f => <span key={f} className="tag tag-blue">{f}</span>)}
                    </div>
                    {error && (
                      <motion.p className="dz-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        ⚠️ {error}
                      </motion.p>
                    )}
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      {user ? '⚡ Upload & Analyze' : '🔒 Sign Up to Analyze'}
                    </button>
                    {!user && <p className="dz-note">Free account required · No credit card</p>}
                  </motion.div>
                )}
                {phase === 'drag' && (
                  <motion.div key="drag" className="dz-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="dz-icon">📂</div>
                    <h3 style={{ color: 'var(--blue2)' }}>Release to analyze!</h3>
                  </motion.div>
                )}
                {phase === 'analyzing' && (
                  <motion.div key="analyzing" className="dz-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="dz-spinner"><div className="dz-spinner-ring"/><span>⚙️</span></div>
                    <h3>Analyzing {count} Resume{count !== 1 ? 's' : ''}…</h3>
                    <p className="dz-stage">{stage}</p>
                    <div className="dz-progress">
                      <div className="pbar dz-pbar"><motion.div className="pbar-fill pbar-blue" style={{ width: `${progress}%` }}/></div>
                      <span>{Math.floor(progress)}%</span>
                    </div>
                  </motion.div>
                )}
                {phase === 'done' && (
                  <motion.div key="done" className="dz-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="dz-done-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>✅</motion.div>
                    <h3>Analysis Complete!</h3>
                    <p>{count} resume{count > 1 ? 's' : ''} scored and ranked via TOPSIS</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <span className="tag tag-green">✓ Scored</span>
                      <span className="tag tag-cyan">✓ Ranked</span>
                      <span className="tag tag-blue">✓ TOPSIS</span>
                    </div>
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' }); }}>View Results →</button>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setPhase('idle'); setProgress(0); setFiles([]); setError(''); }}>New Batch</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="upload-features">
            {[
              { icon: '🧠', title: 'Spatial Intelligence', desc: 'pdfplumber extracts your resume with spatial context — section boundaries, columns, headers all detected accurately.', color: '#3b82f6', delay: 0.1 },
              { icon: '🔗', title: 'Section Scoring', desc: 'Each section is scored independently with configurable weights — Contact, Education, Experience, Skills, Projects, and more.', color: '#22d3ee', delay: 0.2 },
              { icon: '⚖️', title: 'TOPSIS Ranking', desc: 'Geometric distance from the ideal profile. No single score dominates — every section matters equally.', color: '#8b5cf6', delay: 0.3 },
              { icon: '🗄️', title: 'PostgreSQL Storage', desc: 'Results persisted in your account database. Revisit past analyses anytime from your dashboard.', color: '#a78bfa', delay: 0.4 },
            ].map(f => (
              <motion.div key={f.title} className="upload-feat glass"
                initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: f.delay }}
                whileHover={{ x: 5, borderColor: f.color }}>
                <div className="upload-feat__icon" style={{ color: f.color, textShadow: `0 0 16px ${f.color}60` }}>{f.icon}</div>
                <div>
                  <h3 className="upload-feat__title">{f.title}</h3>
                  <p className="upload-feat__desc">{f.desc}</p>
                </div>
                <div className="upload-feat__bar" style={{ background: f.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
