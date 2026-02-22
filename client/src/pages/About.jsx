import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { TEAM } from '../data/mockData';
import './About.css';

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <PageLayout className="page-layout--about">
      <section className="about-section">
          <div className="container">
            <motion.div
              className="about-header"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              ref={ref}
            >
              <span className="eyebrow">About</span>
              <h1 className="section-title">Meet the <span className="grad">Team</span></h1>
              <p className="about-intro">
                RankSense AI is built by a small team for SMART ABES Hackathon 2.0 (AI Track · PS-AI-01).
                We combine document AI (LayoutLMv3), semantic embeddings (SBERT), and multi-criteria ranking (TOPSIS)
                to make resume screening fair, fast, and explainable.
              </p>
              <Link to="/upload" className="btn btn-primary btn-lg">Upload Resumes →</Link>
            </motion.div>

            <div className="about-team-grid">
              {TEAM.map((m, i) => (
                <motion.div
                  key={m.name}
                  className="about-member glass"
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="about-member__av"
                    style={{
                      background: `linear-gradient(135deg,${m.color},${m.color}88)`,
                      boxShadow: `0 0 20px ${m.color}40`,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <div className="about-member__name">{m.name}</div>
                  <div className="about-member__role">{m.role}</div>
                  <a href={`mailto:${m.email}`} className="about-member__email">
                    {m.email}
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="about-badges"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <span className="tag tag-blue">Team ID: 441176ae</span>
              <span className="tag tag-cyan">AI Track</span>
              <span className="tag tag-violet">PS-AI-01</span>
              <span className="tag tag-green">ABES Hackathon 2.0</span>
            </motion.div>
          </div>
      </section>
    </PageLayout>
  );
}
