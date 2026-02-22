// ─── UPLOAD PAGE ─────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Upload.css';

const STAGES_TEXT = [
  'Ingesting files into FastAPI pipeline...',
  'Running pdfplumber spatial extraction...',
  'Processing with LayoutLMv3 model...',
  'Applying SBERT semantic normalization...',
  'Running TOPSIS ranking algorithm...',
  'Rendering results to dashboard...',
];

export function Upload({ onComplete, onAuthClick, user }) {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const startAnalysis = (n = 5) => {
    if (!user) { onAuthClick('signup'); return; }
    setCount(n); setPhase('analyzing'); setProgress(0); let si = 0; setStage(STAGES_TEXT[0]);
    const iv = setInterval(() => {
      setProgress(p => {
        const np = p + Math.random() * 7 + 3;
        const ns = Math.min(Math.floor(np / (100 / STAGES_TEXT.length)), STAGES_TEXT.length - 1);
        if (ns !== si) { si = ns; setStage(STAGES_TEXT[si]); }
        if (np >= 100) { clearInterval(iv); setPhase('done'); onComplete?.(); return 100; }
        return np;
      });
    }, 100);
  };

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
            <div className={`dropzone glass ${phase === 'drag' ? 'dropzone--drag' : ''} ${phase === 'done' ? 'dropzone--done' : ''}`}
              onDragOver={e => { e.preventDefault(); setPhase('drag'); }}
              onDragLeave={() => phase === 'drag' && setPhase('idle')}
              onDrop={e => { e.preventDefault(); startAnalysis(e.dataTransfer.files.length || 5); }}
              onClick={() => phase === 'idle' && startAnalysis()}>
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div key="idle" className="dz-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="dz-icon" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>📄</motion.div>
                    <h3>Drop Resumes Here</h3>
                    <p>PDF, DOCX, DOC — up to 25 files per batch</p>
                    <div className="dz-formats">
                      {['PDF','DOCX','DOC','TXT','ODT'].map(f => <span key={f} className="tag tag-blue">{f}</span>)}
                    </div>
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); startAnalysis(); }}>
                      {user ? '⚡ Run Demo Analysis' : '🔒 Sign Up to Analyze'}
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
                    <p>{count} resumes scored and ranked via TOPSIS</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <span className="tag tag-green">✓ Scored</span><span className="tag tag-cyan">✓ Ranked</span><span className="tag tag-blue">✓ TOPSIS</span>
                    </div>
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' }); }}>View Results →</button>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setPhase('idle'); setProgress(0); }}>New Batch</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="upload-features">
            {[
              { icon: '🧠', title: 'Spatial Intelligence', desc: 'LayoutLMv3 understands your resume as a 2D document — not just a text stream. Section context matters.', color: '#3b82f6', delay: 0.1 },
              { icon: '🔗', title: 'Semantic Normalization', desc: 'SBERT ensures "ML Researcher" and "Machine Learning Engineer" are treated identically in scoring.', color: '#22d3ee', delay: 0.2 },
              { icon: '⚖️', title: 'TOPSIS Ranking', desc: 'Geometric distance from the ideal profile. No single score dominates — every section matters equally.', color: '#8b5cf6', delay: 0.3 },
              { icon: '⚡', title: 'Async Processing', desc: 'Celery + Redis distributes work across workers. Process 25+ resumes without any UI freezing.', color: '#a78bfa', delay: 0.4 },
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
