import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { apiGetLatestBatch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Analysis.css';

function Ring({ score, size = 180 }) {
  const r = size * 0.4, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ;
  const cx = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs><linearGradient id={`rg${size}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(59,130,246,0.07)" strokeWidth={size*0.065}/>
        <motion.circle cx={cx} cy={cx} r={r} fill="none" stroke={`url(#rg${size})`} strokeWidth={size*0.065} strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.5, ease: [0.4,0,0.2,1] }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.6))' }} />
      </svg>
      <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
        <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:size*0.22,lineHeight:1,background:'linear-gradient(135deg,#3b82f6,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{Math.round(score)}</div>
        <div style={{ fontSize:size*0.065,color:'var(--text3)',letterSpacing:1,textTransform:'uppercase',marginTop:2 }}>score</div>
      </div>
    </div>
  );
}

function SCard({ name, data, i }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const col = data.level === 'excellent' ? '#3b82f6' : data.level === 'good' ? '#22d3ee' : data.level === 'moderate' ? '#f59e0b' : '#f43f5e';
  const tClass = data.level === 'excellent' ? 'tag-blue' : data.level === 'good' ? 'tag-cyan' : data.level === 'moderate' ? 'tag-amber' : 'tag-rose';
  return (
    <motion.div ref={ref} className="scard glass" style={{ '--sc': col }}
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.06 }}
      whileHover={{ scale: 1.02 }}>
      <div className="scard__head">
        <span className="scard__name">{name}</span>
        <span className="scard__score" style={{ color: col }}>{data.score}<sub>/100</sub></span>
      </div>
      <div className="pbar scard__bar">
        <motion.div className="pbar-fill" style={{ background: `linear-gradient(90deg,${col}80,${col})`, boxShadow:`0 0 8px ${col}40` }}
          initial={{ width: 0 }} animate={inView ? { width: `${data.score}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: i * 0.06 + 0.15 }} />
      </div>
      <div className="scard__foot">
        <p className="scard__fb">{data.feedback}</p>
        <span className={`tag ${tClass}`}>{data.level}</span>
      </div>
      <div className="scard__wt">Weight: {data.weight}%</div>
    </motion.div>
  );
}

function EmptyState({ user }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>📊</div>
      <h3 style={{ fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>No Analysis Yet</h3>
      <p style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
        {user
          ? 'Upload resumes from the Upload page to see your section-by-section analysis here.'
          : 'Sign in and upload resumes to unlock deep scoring analysis.'}
      </p>
    </div>
  );
}

export default function Analysis() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  // Try sessionStorage first (fresh upload), then API for latest batch
  useEffect(() => {
    const stored = sessionStorage.getItem('rs_batch');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.candidates?.length) {
          setCandidates(data.candidates);
          setActiveId(data.candidates[0].id);
          return;
        }
      } catch (_) {}
    }

    if (!user) return;
    setLoading(true);
    apiGetLatestBatch()
      .then(data => {
        if (data.candidates?.length) {
          setCandidates(data.candidates);
          setActiveId(data.candidates[0].id);
        }
      })
      .catch(err => {
        if (!err.message?.includes('404')) setFetchError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const c = candidates.find(x => x.id === activeId);
  const radarData = c ? Object.entries(c.sections).map(([k, v]) => ({ section: k.split(' ')[0], score: v.score })) : [];

  return (
    <section id="analysis" className="analysis-section" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Step 02 — Analysis</span>
          <h2 className="section-title">Section-by-Section<br /><span className="grad">Deep Scoring</span></h2>
          <p className="section-sub">Every section independently scored, weighted, and analyzed. Select a candidate to explore their full breakdown.</p>
        </motion.div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 16px' }} />
            Loading analysis...
          </div>
        )}

        {!loading && candidates.length === 0 && <EmptyState user={user} />}

        {!loading && candidates.length > 0 && (
          <>
            {/* Tabs */}
            <motion.div className="analysis-tabs" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
              {candidates.map(cd => (
                <button key={cd.id} className={`atab ${activeId === cd.id ? 'atab--active' : ''}`} onClick={() => setActiveId(cd.id)}
                  style={activeId === cd.id ? { '--tc': cd.color, borderColor: cd.color, background: `${cd.color}12` } : {}}>
                  <div className="atab__av" style={{ background: `linear-gradient(135deg,${cd.color},${cd.color}88)` }}>{cd.avatar}</div>
                  <div className="atab__info">
                    <span className="atab__name">{cd.name.split(' ')[0]}</span>
                    <span className="atab__rank" style={{ color: cd.color }}>#{cd.rank} · {cd.total}</span>
                  </div>
                </button>
              ))}
            </motion.div>

            {c && (
              <AnimatePresence mode="wait">
                <motion.div key={activeId} className="analysis-panel"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  {/* Left */}
                  <div className="ap-left glass">
                    <div className="ap-cand">
                      <div className="ap-av" style={{ background: `linear-gradient(135deg,${c.color},${c.color}88)`, boxShadow: `0 0 20px ${c.color}40` }}>{c.avatar}</div>
                      <div className="ap-info">
                        <h3 className="ap-name">{c.name}</h3>
                        <div className="ap-role">{c.role}</div>
                        <div style={{ display:'flex',gap:6,marginTop:6 }}>
                          <span className="tag tag-blue">{c.experience}</span>
                          <span className="tag tag-cyan">{c.education}</span>
                        </div>
                      </div>
                      <div className="ap-rank" style={{ color: c.color }}>#{c.rank}</div>
                    </div>

                    <div className="ap-ring-row">
                      <Ring score={c.total} size={160} />
                      <div>
                        <div className="ap-grade" style={{ color: c.gradeColor, textShadow: `0 0 30px ${c.gradeColor}50` }}>{c.grade}</div>
                        <div className="ap-topsis-label">TOPSIS</div>
                        <div className="ap-topsis-val" style={{ color: c.gradeColor }}>{Math.round(c.topsis * 100)}%</div>
                      </div>
                    </div>

                    <div className="divider" />

                    <div className="ap-insights">
                      <div className="ap-sub-title">AI Insights</div>
                      {(c.insights || []).map((ins, i) => (
                        <motion.div key={i} className={`ap-insight ap-insight--${ins.type}`}
                          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
                          <div className={`ap-idot ap-idot--${ins.type}`} />{ins.text}
                        </motion.div>
                      ))}
                    </div>

                    <div className="divider" />

                    <div className="ap-kws">
                      <div className="ap-sub-title">Matched Keywords</div>
                      <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                        {(c.keywords || []).map(k => <span key={k} className="tag tag-blue">{k}</span>)}
                        {(!c.keywords || c.keywords.length === 0) && <span style={{ color: 'var(--text3)', fontSize: 13 }}>No keywords detected</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="ap-right">
                    <div className="ap-radar glass">
                      <div className="ap-sub-title" style={{ marginBottom: 16 }}>Score Radar</div>
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(59,130,246,0.1)" />
                          <PolarAngleAxis dataKey="section" tick={{ fill:'var(--text2)', fontSize:11, fontFamily:'Outfit' }} />
                          <Radar name="Score" dataKey="score" stroke={c.color} fill={`${c.color}18`} strokeWidth={2}
                            dot={{ fill: c.color, r: 3, filter: `drop-shadow(0 0 4px ${c.color})` }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="scards-grid">
                      {Object.entries(c.sections || {}).map(([name, data], i) => (
                        <SCard key={name} name={name} data={data} i={i} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}

        {fetchError && (
          <div style={{ textAlign: 'center', padding: 20, color: '#f43f5e', fontSize: 14 }}>
            ⚠️ {fetchError}
          </div>
        )}
      </div>
    </section>
  );
}
