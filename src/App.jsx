import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import PageLayout from './components/PageLayout';
import Hero from './pages/Hero';
import Features from './pages/Features';
import About from './pages/About';
import { Upload } from './pages/Upload';
import Analysis from './pages/Analysis';
import { Ranking, Pipeline, Pricing, FAQ } from './pages/OtherPages';

function LoadingScreen({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="loader" style={{ position:'fixed',inset:0,zIndex:9999,background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:28 }}
          exit={{ opacity:0,scale:1.04 }} transition={{ duration:0.6,ease:[0.4,0,0.2,1] }}>
          <motion.div initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }} transition={{ duration:0.6 }} style={{ textAlign:'center' }}>
            <motion.div animate={{ rotate:[0,360] }} transition={{ duration:8,repeat:Infinity,ease:'linear' }} style={{ display:'inline-block',marginBottom:20,filter:'drop-shadow(0 0 24px rgba(59,130,246,0.6))' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <path d="M36 4L68 20V52L36 68L4 52V20L36 4Z" stroke="url(#loadG)" strokeWidth="2" fill="none"/>
                <path d="M20 48L28 27L38 38L48 24" stroke="url(#loadG)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="loadG" x1="0" y1="0" x2="72" y2="72"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
              </svg>
            </motion.div>
            <motion.div style={{ fontFamily:'Syne,sans-serif',fontSize:34,fontWeight:800,color:'#f0f6ff',letterSpacing:'-0.02em' }}
              initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}>
              Rank<span style={{ background:'linear-gradient(135deg,#3b82f6,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Sense</span> AI
            </motion.div>
            <motion.div style={{ fontSize:12,color:'#3a5a80',letterSpacing:3,textTransform:'uppercase',marginTop:8 }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
              Resume Intelligence Platform
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} style={{ width:280 }}>
            <div style={{ height:2,background:'rgba(59,130,246,0.1)',borderRadius:99,overflow:'hidden' }}>
              <motion.div style={{ height:'100%',background:'linear-gradient(90deg,#3b82f6,#22d3ee)',borderRadius:99 }}
                initial={{ width:0 }} animate={{ width:'100%' }} transition={{ duration:1.8,ease:[0.4,0,0.2,1] }}/>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',marginTop:10,fontSize:11,color:'#3a5a80',letterSpacing:0.5 }}>
              <span>Initializing LayoutLMv3</span><span>Loading TOPSIS engine</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomePage({ onAuthClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const onAnalyzeClick = () => navigate('/upload');
  const onWatchDemo = () => navigate('/pipeline');
  return (
    <>
      <Hero onAnalyzeClick={onAnalyzeClick} onAuthClick={onAuthClick} onWatchDemo={onWatchDemo} />
      <Features />
    </>
  );
}

function UploadPage({ onAuthClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const onComplete = () => navigate('/analysis');
  return (
    <PageLayout className="page-layout--upload">
      <div className="page-content">
        <Upload onComplete={onComplete} onAuthClick={onAuthClick} user={user} />
      </div>
    </PageLayout>
  );
}

function AnalysisPage() {
  return (
    <PageLayout className="page-layout--analysis">
      <div className="page-content">
        <Analysis />
      </div>
    </PageLayout>
  );
}

function RankingPage() {
  return (
    <PageLayout className="page-layout--ranking">
      <div className="page-content">
        <Ranking />
      </div>
    </PageLayout>
  );
}

function PipelinePage() {
  return (
    <PageLayout className="page-layout--pipeline">
      <div className="page-content">
        <Pipeline />
      </div>
    </PageLayout>
  );
}

function PricingPage({ onAuthClick }) {
  return (
    <PageLayout className="page-layout--pricing">
      <div className="page-content">
        <Pricing onAuthClick={onAuthClick} />
      </div>
    </PageLayout>
  );
}

function FAQPage() {
  return (
    <PageLayout className="page-layout--faq">
      <div className="page-content">
        <FAQ />
      </div>
    </PageLayout>
  );
}

function AboutPage() {
  return <About />;
}

function AppInner() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState(null);
  const { user } = useAuth();

  useEffect(() => { const t = setTimeout(() => setLoading(false), 2400); return () => clearTimeout(t); }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    const move = (e) => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const onAuthClick = (mode) => setAuthMode(mode);

  return (
    <div style={{ minHeight: '100vh' }}>
      <LoadingScreen done={!loading} />

      {!loading && (
        <>
          <div id="cursor-glow" />
          <ParticleCanvas darkMode={darkMode} />

          <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} onAuthClick={onAuthClick} />

          <Routes>
            <Route path="/" element={<HomePage onAuthClick={onAuthClick} />} />
            <Route path="/upload" element={<UploadPage onAuthClick={onAuthClick} />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/pricing" element={<PricingPage onAuthClick={onAuthClick} />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>

          <Footer onAuthClick={onAuthClick} />

          <AnimatePresence>
            {authMode && (
              <AuthModal
                mode={authMode}
                onClose={() => setAuthMode(null)}
                onSwitch={(m) => setAuthMode(m)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
