import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CountUp from 'react-countup';
import { PIPELINE_STAGES, METRICS, PLANS, FAQS } from '../data/mockData';
import './OtherPages.css';

// ─── RANKING ─────────────────────────────────────────────────────────────
function RankRow({ c, i }) {
  const [open, setOpen] = useState(false);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <motion.div className="rrow" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
      <div className={`rrow__main glass ${open ? 'rrow__main--open' : ''}`} onClick={() => setOpen(o => !o)}
        style={{ '--rc': c.color, borderLeft: `3px solid ${i < 3 ? c.color : 'var(--border)'}` }}>
        <div className="rrow__medal">{i < 3 ? <span className="rrow__emoji">{medals[i]}</span> : <div className="rrow__num">#{i+1}</div>}</div>
        <div className="rrow__av" style={{ background: `linear-gradient(135deg,${c.color},${c.color}88)`, boxShadow: i===0?`0 0 20px ${c.color}50`:'' }}>{c.avatar}</div>
        <div className="rrow__info">
          <div className="rrow__name">{c.name}</div>
          <div className="rrow__role">{c.role} · {c.location}</div>
        </div>
        <div className="rrow__scores">
          <div className="rrow__score-item"><span style={{ color: c.color }}>{c.total}</span><small>Total</small></div>
          <div className="rrow__score-item rrow__score-item--hide"><span style={{ color: c.gradeColor }}>{Math.round(c.topsis*100)}%</span><small>TOPSIS</small></div>
          <div className="rrow__grade" style={{ color: c.gradeColor }}>{c.grade}</div>
        </div>
        <div className="rrow__bar-wrap rrow__bar-wrap--hide">
          <div className="pbar" style={{ width: 120 }}>
            <motion.div className="pbar-fill" style={{ background: c.color, width: `${c.total}%` }} initial={{ width: 0 }} animate={{ width: `${c.total}%` }} transition={{ duration: 1.2, delay: i*0.08+0.3 }}/>
          </div>
        </div>
        <motion.div className="rrow__toggle" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>▼</motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="rrow__expand glass" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="rrow__expand-inner">
              <div className="rrow__mini-scores">
                {Object.entries(c.sections).map(([n, d]) => {
                  const col = d.level==='excellent'?'#3b82f6':d.level==='good'?'#22d3ee':d.level==='moderate'?'#f59e0b':'#f43f5e';
                  return <div key={n} className="rrow__mini"><div style={{fontFamily:'Syne',fontWeight:800,fontSize:20,color:col}}>{d.score}</div><div style={{fontSize:11,color:'var(--text3)',marginTop:3,textAlign:'center'}}>{n.split(' ').map(w=>w[0]).join('')}</div></div>;
                })}
              </div>
              <div className="rrow__insights">
                {c.insights.map((ins,j)=>(
                  <div key={j} className="rrow__insight">
                    <div className={`ap-idot ap-idot--${ins.type}`}/>{ins.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Ranking() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const chartData = CANDIDATES.map(c => ({ name: c.name.split(' ')[0], score: c.total, color: c.color }));

  return (
    <section id="ranking" className="page-section" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Step 03 — Rankings</span>
          <h2 className="section-title">TOPSIS <span className="grad">Leaderboard</span></h2>
          <p className="section-sub">Geometric distance from the ideal profile. Bias-free, reproducible, multi-dimensional ranking.</p>
        </motion.div>

        <div className="ranking-layout">
          <div className="ranking-list">{CANDIDATES.map((c,i) => <RankRow key={c.id} c={c} i={i}/>)}</div>

          <div className="ranking-side">
            <motion.div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 20 }}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
              <div className="ap-sub-title" style={{ marginBottom: 16 }}>Score Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 16 }}>
                  <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text2)', fontFamily: 'Outfit' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={{ background:'var(--glass)',border:'1px solid var(--border)',borderRadius:12,fontSize:12,fontFamily:'Outfit' }} cursor={{ fill:'rgba(59,130,246,0.05)' }} />
                  <Bar dataKey="score" radius={[0,8,8,0]}>{chartData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="glass topsis-info" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45 }}>
              <div className="topsis-info__title"><span>⚖️</span> TOPSIS Explained</div>
              <p>Each candidate's geometric distance from both the <strong>ideal best</strong> and <strong>ideal worst</strong> is calculated.</p>
              <div className="topsis-formula glass2">
                <code>Score = d⁻ / (d⁺ + d⁻)</code>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:10,marginTop:16 }}>
                {CANDIDATES.map(c=>(
                  <div key={c.id} style={{ display:'flex',flexDirection:'column',gap:4 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',fontSize:12 }}>
                      <span style={{color:'var(--text2)'}}>{c.name.split(' ')[0]}</span>
                      <span style={{color:c.gradeColor,fontFamily:'Syne',fontWeight:700}}>{Math.round(c.topsis*100)}%</span>
                    </div>
                    <div className="pbar" style={{ height: 4 }}>
                      <motion.div className="pbar-fill" style={{ background: c.color, width: `${c.topsis*100}%` }}
                        initial={{ width: 0 }} animate={inView ? { width: `${c.topsis*100}%` } : {}} transition={{ duration: 1.2, delay: 0.6 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────
export function Pipeline() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <section id="pipeline" className="page-section" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Architecture</span>
          <h2 className="section-title">5-Stage AI <span className="grad">Pipeline</span></h2>
          <p className="section-sub">From file upload to ranked results — every stage precision-engineered for accuracy and scale.</p>
        </motion.div>

        <div className="pipeline-layout">
          <div className="pipeline-steps">
            {PIPELINE_STAGES.map((s, i) => (
              <motion.div key={s.id} className="pstep glass"
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: s.color }}
                style={{ borderLeft: `3px solid ${s.color}` }}>
                {i < PIPELINE_STAGES.length - 1 && (
                  <motion.div className="pstep__connector" style={{ background: s.color }}
                    initial={{ height: 0 }} animate={inView ? { height: '100%' } : {}} transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }} />
                )}
                <div className="pstep__header">
                  <div className="pstep__icon-wrap" style={{ background: `${s.color}12`, border:`1px solid ${s.color}25` }}>
                    <motion.span className="pstep__icon" whileHover={{ scale: 1.2, rotate: -8 }}>{s.icon}</motion.span>
                  </div>
                  <div>
                    <div className="pstep__num" style={{ color: s.color }}>Stage {String(s.id).padStart(2,'0')}</div>
                    <div className="pstep__title">{s.title}</div>
                    <div className="pstep__tech">{s.tech}</div>
                  </div>
                </div>
                <p className="pstep__desc">{s.desc}</p>
                <div className="pstep__tags">{s.techs.map(t=><span key={t} className="pstep__tag" style={{color:s.color,borderColor:`${s.color}30`,background:`${s.color}08`}}>{t}</span>)}</div>
              </motion.div>
            ))}
          </div>

          {/* Metrics */}
          <div className="metrics-wrap">
            <div className="metrics-grid">
              {METRICS.map((m, i) => {
                const { ref: mr, inView: mi } = useInView({ threshold: 0.4, triggerOnce: true });
                return (
                  <motion.div key={m.label} ref={mr} className="mcard glass"
                    initial={{ opacity: 0, scale: 0.88 }} animate={mi ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ y: -6 }}>
                    <div className="mcard__icon">{m.icon}</div>
                    <div className="mcard__val" style={{ color: m.color }}>
                      {mi ? <CountUp end={m.value} decimals={m.decimal||0} duration={2} delay={i*0.08} suffix={m.suffix}/> : `${m.value}${m.suffix}`}
                    </div>
                    <div className="mcard__label">{m.label}</div>
                    <div className="mcard__sub">{m.sub}</div>
                    <div className="mcard__glow" style={{ background: m.color }}/>
                  </motion.div>
                );
              })}
            </div>
            <motion.div className="tech-stack glass" initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
              <div className="ap-sub-title" style={{ marginBottom: 14 }}>Full Stack</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                {['LayoutLMv3','SBERT','TOPSIS','FastAPI','Celery','Redis','pdfplumber','PostgreSQL','WebSockets','React','Vite','Model Quantization'].map(t=>(
                  <span key={t} className="tag tag-blue" style={{ fontSize:12, padding:'5px 14px' }}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────
export function Pricing({ onAuthClick }) {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <section id="pricing" className="page-section" ref={ref}>
      <div className="container">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">Pricing</span>
          <h2 className="section-title">Simple, <span className="grad">transparent</span> pricing</h2>
          <p className="section-sub" style={{ margin:'0 auto 64px', textAlign:'center' }}>Start for free. Upgrade when you need more power. No hidden fees.</p>
        </motion.div>

        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} className={`plan-card glass ${plan.popular ? 'plan-card--popular' : ''}`}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }} style={{ '--pc': plan.color }}>
              {plan.popular && <div className="plan-badge" style={{ background:`linear-gradient(135deg,${plan.color},var(--cyan))` }}>Most Popular</div>}
              <div className="plan-top">
                <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
                <div className="plan-price">
                  <span className="plan-dollar">$</span>
                  <span className="plan-num">{plan.price}</span>
                  <span className="plan-period">/month</span>
                </div>
              </div>
              <div className="divider" style={{ margin:'20px 0' }}/>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f}><span style={{ color: plan.color }}>✓</span>{f}</li>
                ))}
              </ul>
              <button className={`btn btn-lg plan-cta ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                style={plan.popular ? { background:`linear-gradient(135deg,${plan.color},var(--cyan))` } : {}}
                onClick={() => onAuthClick('signup')}>
                {plan.cta}
              </button>
              {plan.popular && <div className="plan-card__glow" style={{ background: plan.color }}/>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────
export function FAQ() {
  const [open, setOpen] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <section id="faq" className="page-section" ref={ref}>
      <div className="container-sm">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Frequently asked<br /><span className="grad">questions</span></h2>
        </motion.div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <motion.div key={i} className="faq-item glass"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <motion.span className="faq-arrow" animate={{ rotate: open === i ? 180 : 0 }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
