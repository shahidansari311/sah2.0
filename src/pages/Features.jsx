import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Features.css';

const FEATURES = [
  { icon: '🧠', title: 'Spatial Intelligence', desc: 'LayoutLMv3 reads document coordinates alongside text, understanding the full spatial hierarchy of every resume — not just raw token streams.', color: '#3b82f6', tag: 'Core' },
  { icon: '🔗', title: 'Semantic Normalization', desc: '"ML Engineer" and "Machine Learning Researcher" map to identical SBERT vectors. Zero keyword-stuffing advantage — only real skills count.', color: '#22d3ee', tag: 'Fairness' },
  { icon: '⚖️', title: 'TOPSIS Ranking', desc: 'Geometric distance from the ideal candidate profile. No single high score can mask a critical section failure — every dimension is balanced.', color: '#8b5cf6', tag: 'Ranking' },
  { icon: '⚡', title: 'Async Batch Processing', desc: 'FastAPI + Celery + Redis processes 25+ resumes in parallel with zero UI blocking. Real-time status updates via WebSockets.', color: '#a78bfa', tag: 'Scale' },
  { icon: '📊', title: '8-Section Scoring', desc: 'Contact, Education, Experience, Skills, Projects, Achievements, Summary, Formatting — each independently scored and weighted by relevance.', color: '#10b981', tag: 'Analysis' },
  { icon: '🎯', title: 'ATS Compatibility Check', desc: 'Automatically flags formatting, fonts, columns, and keywords that may prevent a resume from passing Applicant Tracking Systems.', color: '#f59e0b', tag: 'ATS' },
  { icon: '📄', title: 'Multi-Format Support', desc: 'PDF, DOCX, DOC, ODT, TXT. Handles complex multi-column layouts, tables, and graphics that standard parsers miss entirely.', color: '#f43f5e', tag: 'Format' },
  { icon: '🔒', title: 'Privacy-First Design', desc: 'All data encrypted in transit and at rest. Resumes auto-deleted after 30 days. GDPR-compliant with full data portability controls.', color: '#22d3ee', tag: 'Privacy' },
];

const BIG_FEATURES = [
  {
    icon: '🧠',
    title: 'LayoutLMv3 Deep Extraction',
    desc: 'Unlike generic text parsers, we process resumes as image-text hybrids. LayoutLMv3 understands that a skill listed under "Projects" has different semantic weight than one under "Interests" — because spatial context is context.',
    points: ['95% section classification accuracy', 'Handles multi-column layouts', 'Understands tables and nested lists', 'Preserves document hierarchy'],
    color: '#3b82f6',
    img: 'layout',
  },
  {
    icon: '⚖️',
    title: 'TOPSIS Multi-Criteria Ranking',
    desc: 'TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) ensures no candidate gets ranked high due to one exceptional section while being weak everywhere else. Every dimension counts proportionally.',
    points: ['Geometric distance from ideal profile', 'Prevents single-metric dominance', '100% reproducible results', 'Configurable section weights'],
    color: '#8b5cf6',
    img: 'topsis',
  },
];

function FeatureCard({ f, i }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  return (
    <motion.div ref={ref} className="feat-card glass"
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.07 }}
      whileHover={{ y: -6, borderColor: f.color }}
      style={{ '--fc': f.color }}>
      <div className="feat-card__top">
        <div className="feat-card__icon" style={{ background: `${f.color}14`, boxShadow: `0 0 20px ${f.color}20` }}>
          {f.icon}
        </div>
        <span className="tag tag-blue feat-card__tag">{f.tag}</span>
      </div>
      <h3 className="feat-card__title">{f.title}</h3>
      <p className="feat-card__desc">{f.desc}</p>
      <div className="feat-card__accent" style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }} />
    </motion.div>
  );
}

export default function Features() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <section id="features" className="features-section">
      <div className="container">
        <motion.div ref={ref} className="features-section__header"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Features</span>
          <h2 className="section-title">Everything you need to<br /><span className="grad">hire smarter</span></h2>
          <p className="section-sub">From spatial parsing to semantic ranking — every feature is engineered for accuracy, fairness, and scale.</p>
        </motion.div>

        <div className="feat-grid">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>

        {/* Big feature spotlights */}
        <div className="feat-spotlights">
          {BIG_FEATURES.map((f, i) => (
            <motion.div key={f.title} className={`feat-spotlight glass ${i % 2 ? 'feat-spotlight--reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <div className="feat-spotlight__text">
                <div className="feat-spotlight__icon" style={{ background: `${f.color}14` }}>{f.icon}</div>
                <h3 className="feat-spotlight__title" style={{ color: f.color }}>{f.title}</h3>
                <p className="feat-spotlight__desc">{f.desc}</p>
                <ul className="feat-spotlight__points">
                  {f.points.map(p => (
                    <li key={p}><span style={{ color: f.color }}>✓</span> {p}</li>
                  ))}
                </ul>
              </div>
              <div className="feat-spotlight__visual">
                {f.img === 'layout' ? <LayoutVisual color={f.color} /> : <TopsisVisual color={f.color} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LayoutVisual({ color }) {
  return (
    <div className="layout-visual glass2">
      <div className="lv-header">
        <div style={{ width: 40, height: 8, background: color, borderRadius: 4, opacity: 0.7 }} />
        <div style={{ width: 80, height: 6, background: 'var(--border2)', borderRadius: 3, marginTop: 6 }} />
      </div>
      {[['Spatial', 95], ['Context', 91], ['Hierarchy', 88], ['Sections', 85], ['Tokens', 82]].map(([l,v],i)=>(
        <div key={l} className="lv-row">
          <span style={{ fontSize: 12, color: 'var(--text2)', width: 64, flexShrink: 0 }}>{l}</span>
          <div className="pbar" style={{ flex: 1 }}>
            <motion.div className="pbar-fill" style={{ background: color, width: `${v}%` }}
              initial={{ width: 0 }} whileInView={{ width: `${v}%` }}
              transition={{ duration: 1, delay: i * 0.1 }} viewport={{ once: true }} />
          </div>
          <span style={{ fontSize: 12, fontFamily: 'Syne', fontWeight: 700, color, width: 24, textAlign: 'right' }}>{v}</span>
        </div>
      ))}
      <div className="lv-badge" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>⚡ 95% Accuracy</div>
    </div>
  );
}

function TopsisVisual({ color }) {
  const items = [
    { name: 'Arjun', topsis: 92.4, c: '#3b82f6' },
    { name: 'Priya', topsis: 85.1, c: '#8b5cf6' },
    { name: 'Rohan', topsis: 74.1, c: '#06b6d4' },
    { name: 'Sneha', topsis: 64.8, c: '#f59e0b' },
    { name: 'Karan', topsis: 51.2, c: '#f43f5e' },
  ];
  return (
    <div className="topsis-visual glass2">
      <div className="tv-title">TOPSIS Rankings</div>
      {items.map((it,i)=>(
        <div key={it.name} className="tv-row">
          <div className="tv-medal" style={{ color: i < 3 ? it.c : 'var(--text3)', fontFamily: 'Syne', fontWeight: 800, fontSize: 14 }}>#{i+1}</div>
          <span style={{ fontSize: 13, color: 'var(--text2)', width: 48, flexShrink: 0 }}>{it.name}</span>
          <div className="pbar" style={{ flex: 1 }}>
            <motion.div className="pbar-fill" style={{ background: it.c, width: `${it.topsis}%` }}
              initial={{ width: 0 }} whileInView={{ width: `${it.topsis}%` }}
              transition={{ duration: 1, delay: i * 0.1 }} viewport={{ once: true }} />
          </div>
          <span style={{ fontSize: 12, fontFamily: 'Syne', fontWeight: 700, color: it.c, width: 40, textAlign: 'right' }}>{it.topsis}%</span>
        </div>
      ))}
      <div className="tv-formula glass">d⁻ / (d⁺ + d⁻) = TOPSIS score</div>
    </div>
  );
}
