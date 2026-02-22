import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const WORDS = ['Intelligence', 'Precision', 'Fairness', 'Accuracy', 'Speed'];

const MARQUEE_ITEMS = ['LayoutLMv3', 'SBERT', 'TOPSIS', 'FastAPI', 'Celery', 'Redis', 'pdfplumber', 'PyTorch', 'NLP', 'WebSockets', 'PostgreSQL', 'Transformers', 'Vector Embeddings', 'Async I/O'];

export default function Hero({ onAnalyzeClick, onAuthClick, onWatchDemo }) {
  const [wordIdx, setWordIdx] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -100]);
  const y2 = useTransform(scrollY, [0, 600], [0, -60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Background elements */}
      <div className="hero__bg-grid" />
      <motion.div className="hero__orb hero__orb--1" style={{ y: y1 }} />
      <motion.div className="hero__orb hero__orb--2" style={{ y: y2 }} />
      <div className="hero__orb hero__orb--3" />

      {/* Hexagon pattern */}
      <div className="hero__hex-pattern" />

      <div className="container">
        <motion.div className="hero__content" style={{ opacity }}>
          {/* Eyebrow badge */}
          <motion.div className="hero__badge"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="hero__badge-dot" />
            <span>SMART ABES Hackathon 2.0 · AI Track · PS-AI-01</span>
            <span className="hero__badge-new">NEW</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="hero__h1"
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Resume
            <div className="hero__word-swap">
              <motion.span key={wordIdx} className="grad"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}>
                {WORDS[wordIdx]}
              </motion.span>
            </div>
            <span>Platform</span>
          </motion.h1>

          {/* Sub */}
          <motion.p className="hero__sub"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Spatial-aware extraction meets semantic ranking. Score every resume section independently,
            then rank the entire batch using <strong>TOPSIS</strong> — the industry standard for multi-criteria decision making.
          </motion.p>

          {/* CTA */}
          <motion.div className="hero__ctas"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <button className="btn btn-primary btn-xl hero__cta-main" onClick={onAnalyzeClick}>
              <span>⚡</span> Analyze Resumes Free
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => (onWatchDemo ? onWatchDemo() : document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' }))}>
              Watch Demo →
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div className="hero__trust"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.45 }}>
            <div className="hero__avatars">
              {['AM','PS','RV','SP','KG'].map((a,i) => (
                <div key={a} className="hero__av" style={{ background: ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#f43f5e'][i], marginLeft: i ? -10 : 0 }}>{a}</div>
              ))}
            </div>
            <span className="hero__trust-text"><strong>1,200+</strong> resumes analyzed this week</span>
            <span className="hero__trust-sep">·</span>
            <span className="hero__trust-text">⭐ <strong>4.9/5</strong> rating</span>
          </motion.div>

          {/* Stats */}
          <motion.div className="hero__stats"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
            {[
              { n: '95%', l: 'Accuracy', icon: '🎯' },
              { n: '0.3s', l: 'Per Resume', icon: '⚡' },
              { n: '25+', l: 'Batch Size', icon: '📦' },
              { n: '8', l: 'Sections Scored', icon: '📊' },
              { n: '0%', l: 'Keyword Bias', icon: '⚖️' },
            ].map(s => (
              <div key={s.l} className="hero__stat glass">
                <div className="hero__stat-icon">{s.icon}</div>
                <div className="hero__stat-num grad">{s.n}</div>
                <div className="hero__stat-label">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Dashboard Preview */}
        <motion.div className="hero__preview-wrap"
          initial={{ opacity: 0, x: 60, rotateY: -12 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ perspective: 1200 }}
        >
          <motion.div className="hero__dashboard"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Dashboard header */}
            <div className="hero__dash-header glass">
              <div className="hero__dash-dots">
                <div style={{ background: '#f43f5e' }} /><div style={{ background: '#f59e0b' }} /><div style={{ background: '#10b981' }} />
              </div>
              <div className="hero__dash-title">RankSense AI Dashboard</div>
              <div className="tag tag-green">● Live</div>
            </div>

            {/* Top row */}
            <div className="hero__dash-row">
              <RingPreview score={91} label="Top Score" color="#3b82f6" />
              <div className="hero__dash-mini-stats">
                {[{l:'Analyzed',v:'5 resumes'},{l:'Ranked',v:'#1 of 5'},{l:'TOPSIS',v:'92.4%'},{l:'Grade',v:'A+'}].map(s=>(
                  <div key={s.l} className="hero__dash-mini glass2">
                    <div className="hero__dash-mini-val">{s.v}</div>
                    <div className="hero__dash-mini-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section bars */}
            <div className="hero__dash-sections">
              <div className="hero__dash-sec-title">Section Breakdown — Arjun Mehta</div>
              {[
                { name: 'Skills', score: 96, color: '#3b82f6' },
                { name: 'Experience', score: 94, color: '#22d3ee' },
                { name: 'Projects', score: 90, color: '#8b5cf6' },
                { name: 'Education', score: 88, color: '#a78bfa' },
                { name: 'Achievements', score: 85, color: '#10b981' },
              ].map((s, i) => (
                <div key={s.name} className="hero__dash-bar-row">
                  <span className="hero__dash-bar-name">{s.name}</span>
                  <div className="pbar" style={{ flex: 1 }}>
                    <motion.div className="pbar-fill" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}50` }}
                      initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                      transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }} />
                  </div>
                  <span className="hero__dash-bar-score" style={{ color: s.color }}>{s.score}</span>
                </div>
              ))}
            </div>

            {/* Rank list */}
            <div className="hero__dash-ranks">
              {[
                { n: 'Arjun Mehta', s: 91.4, r: 1, av: 'AM', c: '#3b82f6' },
                { n: 'Priya Sharma', s: 84.7, r: 2, av: 'PS', c: '#8b5cf6' },
                { n: 'Rohan Verma', s: 78.2, r: 3, av: 'RV', c: '#06b6d4' },
              ].map(c => (
                <div key={c.n} className="hero__dash-rank-row glass2">
                  <div className="hero__dash-rank-medal">{c.r === 1 ? '🥇' : c.r === 2 ? '🥈' : '🥉'}</div>
                  <div className="hero__dash-rank-av" style={{ background: `linear-gradient(135deg,${c.c},${c.c}88)` }}>{c.av}</div>
                  <span className="hero__dash-rank-name">{c.n}</span>
                  <span className="hero__dash-rank-score" style={{ color: c.c }}>{c.s}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div className="hero__float-badge hero__float-badge--1 glass"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            style={{ animation: 'float 5s ease-in-out infinite' }}>
            ✅ Analysis Complete
          </motion.div>
          <motion.div className="hero__float-badge hero__float-badge--2 glass"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
            style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
            🧠 LayoutLMv3 Ready
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div className="hero__marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="hero__marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="hero__marquee-item">
              <span className="hero__marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="hero__scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>↓</motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}

function RingPreview({ score, label, color }) {
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="ring-preview">
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
          <defs><linearGradient id="rGrad"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
          <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="10"/>
          <motion.circle cx="55" cy="55" r={r} fill="none" stroke="url(#rGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: 0.8 }} style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.6))' }} />
        </svg>
        <div className="ring-preview__center">
          <div className="ring-preview__val grad">{score}</div>
          <div className="ring-preview__sub">/ 100</div>
        </div>
      </div>
      <div className="ring-preview__label">{label}</div>
    </div>
  );
}
