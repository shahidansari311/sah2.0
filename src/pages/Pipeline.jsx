import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PIPELINE_STAGES, METRICS } from '../data/mockData';
import CountUp from 'react-countup';
import './Pipeline.css';

function PipelineCard({ stage, index }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="pipeline-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Connector line above */}
      {index > 0 && (
        <div className="pipeline-card__connector">
          <motion.div
            className="pipeline-card__connector-line"
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            style={{ background: stage.color }}
          />
          <div className="pipeline-card__connector-dot" style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}60` }} />
        </div>
      )}

      <motion.div
        className="pipeline-card__inner glass"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        style={{ '--stage-color': stage.color }}
      >
        {/* Step number + icon */}
        <div className="pipeline-card__header">
          <div
            className="pipeline-card__icon-wrap"
            style={{ background: `${stage.color}18`, border: `1px solid ${stage.color}30` }}
          >
            <motion.span
              className="pipeline-card__icon"
              animate={hovered ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {stage.icon}
            </motion.span>
          </div>
          <div>
            <div className="pipeline-card__step-num" style={{ color: stage.color }}>
              Stage {stage.id.toString().padStart(2, '0')}
            </div>
            <h3 className="pipeline-card__title">{stage.title}</h3>
            <div className="pipeline-card__subtitle">{stage.subtitle}</div>
          </div>
        </div>

        <p className="pipeline-card__desc">{stage.description}</p>

        {/* Tech tags */}
        <div className="pipeline-card__techs">
          {stage.techs.map(t => (
            <span key={t} className="pipeline-card__tech" style={{ color: stage.color, borderColor: `${stage.color}30`, background: `${stage.color}08` }}>
              {t}
            </span>
          ))}
        </div>

        {/* Glow edge */}
        <div className="pipeline-card__glow" style={{ background: stage.color }} />
      </motion.div>
    </motion.div>
  );
}

function MetricCard({ metric, index }) {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  const numericVal = parseFloat(metric.value);
  const isDecimal = metric.value.includes('.');

  return (
    <motion.div
      ref={ref}
      className="metric-card glass glass-hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="metric-card__icon" style={{ textShadow: `0 0 20px ${metric.color}80` }}>
        {metric.icon}
      </div>

      <div className="metric-card__value" style={{ color: metric.color }}>
        {inView ? (
          <CountUp
            end={numericVal}
            decimals={isDecimal ? 1 : 0}
            duration={2}
            delay={index * 0.08}
            suffix={metric.suffix}
          />
        ) : `${metric.value}${metric.suffix}`}
      </div>

      <div className="metric-card__label">{metric.label}</div>
      <div className="metric-card__sub">{metric.sub}</div>

      {/* Ambient glow */}
      <div className="metric-card__bg-glow" style={{ background: metric.color }} />
    </motion.div>
  );
}

export default function Pipeline() {
  const { ref: headerRef, inView: headerIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <>
      {/* ─── PIPELINE SECTION ─── */}
      <section id="pipeline" className="pipeline-section">
        <div className="container">
          <motion.div
            ref={headerRef}
            className="pipeline-section__header"
            initial={{ opacity: 0, y: 30 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">Step 04 — Architecture</span>
            <h2 className="section-title">
              5-Stage AI<br />
              <span className="grad-blue">Intelligence Pipeline</span>
            </h2>
            <p className="section-subtitle">
              From raw file upload to ranked results — every stage is precision-engineered
              for accuracy, fairness, and scale.
            </p>
          </motion.div>

          <div className="pipeline-layout">
            {/* Stages */}
            <div className="pipeline-stages">
              {PIPELINE_STAGES.map((stage, i) => (
                <PipelineCard key={stage.id} stage={stage} index={i} />
              ))}
            </div>

            {/* Flow diagram */}
            <div className="pipeline-diagram">
              <FlowDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* ─── METRICS SECTION ─── */}
      <section id="metrics" className="metrics-section">
        <div className="container">
          <motion.div
            className="metrics-section__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-eyebrow">Why RankSense AI</span>
            <h2 className="section-title">
              Built for <span className="grad-blue">Fairness,</span><br />
              Speed & Accuracy
            </h2>
          </motion.div>

          <div className="metrics-grid">
            {METRICS.map((m, i) => (
              <MetricCard key={m.label} metric={m} index={i} />
            ))}
          </div>

          {/* Tech stack */}
          <motion.div
            className="tech-stack glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="tech-stack__title">Full Technology Stack</div>
            <div className="tech-stack__tags">
              {['LayoutLMv3', 'SBERT', 'TOPSIS', 'FastAPI', 'Celery', 'Redis', 'pdfplumber', 'PostgreSQL', 'WebSockets', 'React', 'Model Quantization', 'Async I/O'].map(t => (
                <span key={t} className="tag tag-blue tech-stack__tag">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FlowDiagram() {
  const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#a78bfa', '#22d3ee'];
  const labels = ['Ingest', 'Parse', 'Extract', 'Score', 'Output'];
  const icons = ['📥', '🗺️', '🧠', '⚖️', '📡'];

  return (
    <motion.div
      className="flow-diagram glass"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="flow-diagram__title">Data Flow</div>
      <div className="flow-diagram__nodes">
        {labels.map((label, i) => (
          <div key={label} className="flow-node-wrap">
            <motion.div
              className="flow-node"
              style={{ background: `${colors[i]}14`, border: `1px solid ${colors[i]}30` }}
              whileHover={{ scale: 1.08, borderColor: colors[i] }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            >
              <div className="flow-node__icon">{icons[i]}</div>
              <div className="flow-node__label" style={{ color: colors[i] }}>{label}</div>
            </motion.div>
            {i < labels.length - 1 && (
              <div className="flow-arrow">
                <motion.div
                  className="flow-arrow__line"
                  style={{ background: `linear-gradient(90deg, ${colors[i]}, ${colors[i + 1]})` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                />
                <div className="flow-arrow__head" style={{ color: colors[i + 1] }}>▶</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data labels */}
      <div className="flow-data-labels">
        <div className="flow-data-label" style={{ color: '#3b82f6' }}>PDF/DOCX Input</div>
        <div className="flow-data-label" style={{ color: '#8b5cf6' }}>Spatial Tokens</div>
        <div className="flow-data-label" style={{ color: '#22d3ee' }}>TOPSIS Ranks</div>
      </div>

      {/* Properties */}
      <div className="flow-props">
        {[
          { label: 'Throughput', val: '25+ resumes / cycle' },
          { label: 'Accuracy', val: '95%+ via LayoutLMv3' },
          { label: 'Latency', val: '~0.3s per resume' },
          { label: 'Bias', val: 'Zero via SBERT' },
        ].map(p => (
          <div key={p.label} className="flow-prop">
            <div className="flow-prop__label">{p.label}</div>
            <div className="flow-prop__val grad-blue">{p.val}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
