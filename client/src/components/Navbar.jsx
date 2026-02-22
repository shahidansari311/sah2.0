import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/' },
  { label: 'Rankings', path: '/ranking' },
  { label: 'Pipeline', path: '/pipeline' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
];

export default function Navbar({ darkMode, toggleDark, onAuthClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isActiveWithDot = (path, label) =>
    location.pathname === path && (path !== '/' || label === 'Home');

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.4,0,0.2,1] }}>
        <div className="nav__inner">
          {/* Logo */}
          <Link to="/" className="nav__logo" onClick={() => setMobileOpen(false)}>
            <div className="nav__logo-mark">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15 2L27 8V22L15 28L3 22V8L15 2Z" stroke="url(#nGrad)" strokeWidth="1.5" fill="none"/>
                <path d="M9 19L12.5 11L17 16L20.5 10" stroke="url(#nGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="nGrad" x1="0" y1="0" x2="30" y2="30"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
              </svg>
            </div>
            <span className="nav__logo-text">Rank<span className="grad">Sense</span></span>
            <span className="nav__logo-badge">AI</span>
          </Link>

          {/* Links */}
          <div className="nav__links">
            {LINKS.map(l => (
              <Link
                key={l.path + l.label}
                to={l.path}
                className={`nav__link ${isActiveWithDot(l.path, l.label) ? 'nav__link--active' : ''}`}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (l.label === 'Features' && location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {l.label}
                {isActiveWithDot(l.path, l.label) && <motion.div className="nav__link-dot" layoutId="navDot" />}
              </Link>
            ))}
          </div>

          {/* Upload CTA + Right */}
          <div className="nav__right">
            <Link to="/upload" className="nav__upload-cta btn btn-primary btn-sm">
              Upload Resumes
            </Link>
            <button className="nav__theme" onClick={toggleDark} title="Toggle theme">
              <AnimatePresence mode="wait">
                <motion.span key={darkMode?'d':'l'} initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} exit={{scale:0,rotate:90}} transition={{duration:0.2}}>
                  {darkMode ? '☀️' : '🌙'}
                </motion.span>
              </AnimatePresence>
            </button>

            {user ? (
              <div className="nav__user-wrap">
                <button className="nav__user-btn" onClick={() => setUserMenuOpen(o => !o)}>
                  <div className="nav__user-avatar">{user.avatar}</div>
                  <span className="nav__user-name">{user.name.split(' ')[0]}</span>
                  <span className="nav__user-chevron">▾</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div className="nav__user-menu glass" initial={{opacity:0,y:-10,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-10,scale:0.95}} transition={{duration:0.2}}>
                      <div className="nav__user-menu-header">
                        <div className="nav__user-menu-avatar">{user.avatar}</div>
                        <div>
                          <div className="nav__user-menu-name">{user.name}</div>
                          <div className="nav__user-menu-email">{user.email}</div>
                        </div>
                      </div>
                      <div className="divider" style={{margin:'10px 0'}}/>
                      <button className="nav__user-menu-item" onClick={() => { go('/upload'); setUserMenuOpen(false); }}>⚡ New Analysis</button>
                      <button className="nav__user-menu-item" onClick={() => { go('/ranking'); setUserMenuOpen(false); }}>📊 My Rankings</button>
                      <button className="nav__user-menu-item" onClick={() => { go('/pricing'); setUserMenuOpen(false); }}>💎 Upgrade Plan</button>
                      <div className="divider" style={{margin:'10px 0'}}/>
                      <button className="nav__user-menu-item nav__user-menu-item--danger" onClick={() => { logout(); setUserMenuOpen(false); }}>🚪 Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="nav__auth-btns">
                <button className="btn btn-ghost btn-sm" onClick={() => onAuthClick('login')}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={() => onAuthClick('signup')}>Get Started →</button>
              </div>
            )}

            {/* Hamburger */}
            <button className="nav__hamburger" onClick={() => setMobileOpen(o => !o)}>
              <span className={mobileOpen ? 'open' : ''}/><span className={mobileOpen ? 'open' : ''}/><span className={mobileOpen ? 'open' : ''}/>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="nav__mobile glass" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
            <Link to="/upload" className="nav__mobile-link nav__mobile-link--cta" onClick={() => setMobileOpen(false)}>
              Upload Resumes →
            </Link>
            {LINKS.map((l,i) => (
              <Link
                key={l.path + l.label}
                to={l.path}
                className={`nav__mobile-link ${isActiveWithDot(l.path, l.label) ? 'nav__mobile-link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <motion.span initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
                  {l.label}
                </motion.span>
              </Link>
            ))}
            <div className="divider" style={{margin:'8px 0'}}/>
            {user ? (
              <button className="nav__mobile-link nav__mobile-link--danger" onClick={() => { logout(); setMobileOpen(false); }}>Sign Out</button>
            ) : (
              <div style={{display:'flex',gap:8,padding:'4px 0'}}>
                <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => { onAuthClick('login'); setMobileOpen(false); }}>Sign In</button>
                <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={() => { onAuthClick('signup'); setMobileOpen(false); }}>Sign Up</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
