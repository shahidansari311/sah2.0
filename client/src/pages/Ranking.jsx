import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CANDIDATES } from '../data/mockData';
import './Ranking.css';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];
const COLORS = ['#3b82f6', '#8b5cf6', '#22d3ee', '#f59e0b', '#f43f5e'];

function RankRow({ candidate, index }) {
  const [expanded, setExpanded] = useState(false);
  const isTop3 = index < 3;

  const sectionData = Object.entries(candidate.sections).map(([name, d]) => ({
    name: name.split(' ')[0],
    score: d.score,
    color: COLORS[index],
  }));

  return (
    <motion.div
      className={`rank-row ${isTop3 ? 'rank-row--top' : ''}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Main row */}
      <div className="rank-row__main glass" onClick={() => setExpanded(!expanded)}>
        {/* Medal / number */}
        <div className="rank-row__medal">
          {isTop3 ? (
            <span className="rank-row__medal-emoji">{RANK_MEDALS[index]}</span>
          ) : (
            <div className="rank-row__medal-num">#{index + 1}</div>
          )}
        </div>

        {/* Candidate */}
        <div className="rank-row__candidate">
          <div
            className="rank-row__avatar"
            style={{ background: `linear-gradient(135deg, ${candidate.avatarColor}, ${candidate.avatarColor}99)` }}
          >
            {candidate.avatar}
          </div>
          <div className="rank-row__info">
            <div className="rank-row__name">{candidate.name}</div>
            <div className="rank-row__role">{candidate.role}</div>
          </div>
        </div>

        {/* Scores */}
        <div className="rank-row__scores">
          <div className="rank-row__total-score">
            <span className="rank-row__score-val" style={{ color: candidate.avatarColor }}>
              {candidate.totalScore}
            </span>
            <span className="rank-row__score-label">Total</span>
          </div>
          <div className="rank-row__topsis">
            <span className="rank-row__score-val">
              {Math.round(candidate.topsisScore * 100)}%
            </span>
            <span className="rank-row__score-label">TOPSIS</span>
          </div>
        </div>

        {/* Grade */}
        <div className="rank-row__grade" style={{ color: candidate.gradeColor }}>
          {candidate.grade}
        </div>

        {/* Bar mini */}
        <div className="rank-row__bar-wrap">
          <div className="progress-track rank-row__bar">
            <motion.div
              className="progress-fill"
              style={{ background: `linear-gradient(90deg, ${candidate.avatarColor}99, ${candidate.avatarColor})` }}
              initial={{ width: 0 }}
              animate={{ width: `${candidate.totalScore}%` }}
              transition={{ duration: 1.2, delay: index * 0.08 + 0.3 }}
            />
          </div>
        </div>

        {/* Expand toggle */}
        <motion.div
          className="rank-row__toggle"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          ▼
        </motion.div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="rank-row__expanded glass"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="rank-expanded__inner">
              {/* Mini section scores */}
              <div className="rank-expanded__sections">
                {Object.entries(candidate.sections).map(([name, data]) => {
                  const col = data.level === 'excellent' ? '#3b82f6' : data.level === 'good' ? '#22d3ee' : data.level === 'moderate' ? '#f59e0b' : '#f43f5e';
                  return (
                    <div key={name} className="rank-mini-score">
                      <div className="rank-mini-score__val" style={{ color: col }}>{data.score}</div>
                      <div className="rank-mini-score__name">{name.replace(' ', '\n')}</div>
                    </div>
                  );
                })}
              </div>

              {/* Bar chart */}
              <div className="rank-expanded__chart">
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={sectionData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans' }}
                      labelStyle={{ color: 'var(--text-primary)' }}
                      itemStyle={{ color: candidate.avatarColor }}
                      cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {sectionData.map((entry, i) => (
                        <Cell key={i} fill={candidate.avatarColor} fillOpacity={0.6 + (entry.score / 100) * 0.4} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="rank-expanded__insights">
                {candidate.insights.map((ins, i) => (
                  <div key={i} className={`insight-item insight-item--${ins.type}`}>
                    <div className={`insight-dot insight-dot--${ins.type}`} />
                    <span>{ins.text}</span>
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

export default function Ranking() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  // Comparison chart data
  const comparisonData = CANDIDATES.map(c => ({
    name: c.name.split(' ')[0],
    score: c.totalScore,
    topsis: Math.round(c.topsisScore * 100),
    color: c.avatarColor,
  }));

  return (
    <section id="ranking" className="ranking-section" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          className="ranking-section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Step 03 — TOPSIS Ranking</span>
          <h2 className="section-title">
            Ranked <span className="grad-blue">Leaderboard</span>
          </h2>
          <p className="section-subtitle">
            Geometric distance from the "Ideal Candidate" profile ensures fair, bias-free ranking.
            No single score dominates — every section matters.
          </p>
        </motion.div>

        <div className="ranking-section__layout">
          {/* Rankings list */}
          <div className="ranking-list">
            {CANDIDATES.map((c, i) => (
              <RankRow key={c.id} candidate={c} index={i} />
            ))}
          </div>

          {/* Side panel */}
          <div className="ranking-side">
            {/* Comparison chart */}
            <motion.div
              className="ranking-chart glass"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="ranking-chart__title">Score Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comparisonData} layout="vertical" margin={{ left: -10, right: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip
                    contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, fontSize: 12 }}
                    cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {comparisonData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* TOPSIS explanation */}
            <motion.div
              className="topsis-card glass"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <div className="topsis-card__title">
                <span>⚖️</span> How TOPSIS Works
              </div>
              <div className="topsis-card__body">
                <p>TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) calculates each candidate's geometric distance from both the <strong>ideal best</strong> and <strong>ideal worst</strong> profiles.</p>
                <div className="topsis-formula glass">
                  <code>TOPSIS Score = d⁻ / (d⁺ + d⁻)</code>
                </div>
                <p>A score of <strong>1.0</strong> means the candidate is perfectly ideal. A score of <strong>0.0</strong> is the worst possible. This prevents any single section from dominating the final rank.</p>
              </div>
              <div className="topsis-card__bars">
                {CANDIDATES.map(c => (
                  <div key={c.id} className="topsis-bar-item">
                    <div className="topsis-bar-item__label">
                      <span>{c.name.split(' ')[0]}</span>
                      <span style={{ color: c.gradeColor }}>{Math.round(c.topsisScore * 100)}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <motion.div
                        className="progress-fill"
                        style={{ background: c.avatarColor }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${c.topsisScore * 100}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 }}
                      />
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
