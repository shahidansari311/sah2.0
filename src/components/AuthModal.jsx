import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const ok = await login(form.email, form.password);
      if (ok) onClose();
    } else {
      if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
      const ok = await signup(form.name, form.email, form.password);
      if (ok) onClose();
    }
  };

  return (
    <motion.div className="auth-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="auth-modal glass"
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative top glow */}
        <div className="auth-modal__glow" />

        {/* Close */}
        <button className="auth-modal__close" onClick={onClose}>✕</button>

        {/* Logo */}
        <div className="auth-modal__logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 3L33 10.5V25.5L18 33L3 25.5V10.5L18 3Z" stroke="url(#amGrad)" strokeWidth="1.5" fill="none"/>
            <path d="M10 23L14 14L19.5 19.5L24 12" stroke="url(#amGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="amGrad" x1="0" y1="0" x2="36" y2="36"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
          </svg>
          <span className="auth-modal__brand">RankSense<span className="grad"> AI</span></span>
        </div>

        {/* Mode tabs */}
        <div className="auth-modal__tabs">
          <button className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`} onClick={() => { onSwitch('login'); setError(''); }}>Sign In</button>
          <button className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`} onClick={() => { onSwitch('signup'); setError(''); }}>Create Account</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form key={mode} className="auth-form" onSubmit={handleSubmit}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="auth-modal__title">
              {mode === 'login' ? 'Welcome back' : 'Start for free'}
              <span>{mode === 'login' ? 'Sign in to your dashboard' : 'Join thousands of recruiters'}</span>
            </div>

            {/* Social logins (cosmetic) */}
            <div className="auth-social">
              <button type="button" className="auth-social-btn glass2">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <button type="button" className="auth-social-btn glass2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text)"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Continue with GitHub
              </button>
            </div>

            <div className="auth-divider"><span>or continue with email</span></div>

            {mode === 'signup' && (
              <div className="input-wrap">
                <label className="input-label">Full Name</label>
                <div className="input-icon-wrap">
                  <input className="input" type="text" placeholder="Arjun Mehta" value={form.name} onChange={e => set('name', e.target.value)} required />
                  <span className="input-icon">👤</span>
                </div>
              </div>
            )}

            <div className="input-wrap">
              <label className="input-label">Email Address</label>
              <div className="input-icon-wrap">
                <input className="input" type="email" placeholder="arjun@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="input-wrap">
              <label className="input-label">Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required style={{ paddingRight: 46 }} />
                <span className="input-icon">🔒</span>
                <button type="button" className="auth-pass-toggle" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="input-wrap">
                <label className="input-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
                  <span className="input-icon">🔑</span>
                </div>
              </div>
            )}

            {error && (
              <motion.div className="auth-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                ⚠️ {error}
              </motion.div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button type="button" className="auth-link">Forgot password?</button>
              </div>
            )}

            <button type="submit" className={`btn btn-primary btn-lg auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                mode === 'login' ? '⚡ Sign In to Dashboard' : '🚀 Create Free Account'
              )}
            </button>

            {mode === 'signup' && (
              <p className="auth-terms">By signing up, you agree to our <button type="button" className="auth-link">Terms of Service</button> and <button type="button" className="auth-link">Privacy Policy</button>.</p>
            )}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
