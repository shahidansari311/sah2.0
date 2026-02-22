import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ onAuthClick }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" stroke="url(#fGrad)" strokeWidth="1.5" fill="none"/>
                <path d="M9 21L13 12L18 17L22 11" stroke="url(#fGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="fGrad" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
              </svg>
              <span className="footer__logo-text">RankSense <span className="grad">AI</span></span>
            </Link>
            <p className="footer__tagline">Automated Resume Intelligence. Spatial extraction, semantic ranking, bias-free TOPSIS scoring — all in one platform.</p>
            <div className="footer__cta-row">
              <Link to="/upload" className="btn btn-primary">Upload Resumes →</Link>
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
              <Link to="/" className="footer__link">Features</Link>
              <Link to="/pipeline" className="footer__link">How It Works</Link>
              <Link to="/pricing" className="footer__link">Pricing</Link>
              <a href="#" className="footer__link">API Docs</a>
              <a href="#" className="footer__link">Changelog</a>
            </div>
            <div className="footer__link-group">
              <div className="footer__link-title">Company</div>
              <Link to="/about" className="footer__link">About</Link>
              <a href="#" className="footer__link">Blog</a>
              <a href="#" className="footer__link">Careers</a>
              <a href="#" className="footer__link">Privacy</a>
              <a href="#" className="footer__link">Terms</a>
            </div>
            <div className="footer__link-group">
              <div className="footer__link-title">Resources</div>
              <a href="#" className="footer__link">Documentation</a>
              <a href="#" className="footer__link">GitHub</a>
              <a href="#" className="footer__link">Support</a>
            </div>
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
