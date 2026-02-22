import { motion } from 'framer-motion';
import { TEAM } from '../data/mockData';
import './Footer.css';

export default function Footer({ onAuthClick }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" stroke="url(#fGrad)" strokeWidth="1.5" fill="none"/>
                <path d="M9 21L13 12L18 17L22 11" stroke="url(#fGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="fGrad" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
              </svg>
              <span className="footer__logo-text">RankSense <span className="grad">AI</span></span>
            </div>
            <p className="footer__tagline">Automated Resume Intelligence. Spatial extraction, semantic ranking, bias-free TOPSIS scoring — all in one platform.</p>
            <div className="footer__cta-row">
              <button className="btn btn-primary" onClick={() => onAuthClick('signup')}>Get Started Free →</button>
            </div>
            <div className="footer__badges">
              <span className="tag tag-blue">Team ID: 441176ae</span>
              <span className="tag tag-cyan">AI Track</span>
              <span className="tag tag-violet">PS-AI-01</span>
              <span className="tag tag-green">ABES Hackathon 2.0</span>
            </div>
          </div>

          <div className="footer__links-col">
            <div className="footer__link-group">
              <div className="footer__link-title">Product</div>
              {['Features','How It Works','Pricing','API Docs','Changelog'].map(l => <a key={l} className="footer__link" href="#">{l}</a>)}
            </div>
            <div className="footer__link-group">
              <div className="footer__link-title">Company</div>
              {['About','Blog','Careers','Privacy','Terms'].map(l => <a key={l} className="footer__link" href="#">{l}</a>)}
            </div>
            <div className="footer__link-group">
              <div className="footer__link-title">Resources</div>
              {['Documentation','GitHub','Discord','Status','Support'].map(l => <a key={l} className="footer__link" href="#">{l}</a>)}
            </div>
          </div>
        </div>

        <div className="divider" style={{ margin: '48px 0' }} />

        {/* Team */}
        <div className="footer__team">
          <div className="footer__team-title">Built by Team RankSense</div>
          <div className="footer__team-grid">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} className="footer__member glass"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ y: -4 }}>
                <div className="footer__member-av" style={{ background: `linear-gradient(135deg,${m.color},${m.color}88)`, boxShadow: `0 0 14px ${m.color}40` }}>{m.avatar}</div>
                <div className="footer__member-name">{m.name}</div>
                <div className="footer__member-role">{m.role}</div>
                <a href={`mailto:${m.email}`} className="footer__member-email">{m.email}</a>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '40px 0 28px' }} />
        <div className="footer__bottom">
          <span>© 2026 RankSense AI · SMART ABES Hackathon 2.0 · All rights reserved</span>
          <div className="footer__bottom-links">
            <a href="#" className="footer__link">Privacy</a>
            <a href="#" className="footer__link">Terms</a>
            <a href="#" className="footer__link">Cookies</a>
          </div>
        </div>
      </div>
      <div className="footer__glow" />
    </footer>
  );
}
