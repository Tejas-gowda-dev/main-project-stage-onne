import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, Cpu, BookOpen, Briefcase, GraduationCap, CheckCircle, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

import { UserSession } from './types';
import AuthModal from './components/AuthModal';

// Import Custom Core Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ThreeBackground from './components/ThreeBackground';
import TestimonialSlider from './components/TestimonialSlider';
import CertificateCard from './components/CertificateCard';
import ProgressTracker from './components/ProgressTracker';
import FloatingParticles from './components/FloatingParticles';

// Import Tab Views
import ProgramsView from './components/ProgramsView';
import DashboardView from './components/DashboardView';
import TrackView from './components/TrackView';
import GlowButton from './components/GlowButton';
import SecureGatedGate from './components/SecureGatedGate';
import AdminPanel from './components/AdminPanel';
import BlogView from './components/BlogView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'track' | 'certificate'>('dashboard');
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('internforge-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Prevent accessing blog if logged in
  useEffect(() => {
    if (user && currentTab === 'blog') {
      setCurrentTab('dashboard');
      window.location.hash = '#/dashboard';
    }
  }, [user, currentTab]);

  const handleLoginClick = () => {
    setIsAuthOpen(true);
  };

  const handleProgressUpdate = (updatedUser: UserSession) => {
    setUser(updatedUser);
    localStorage.setItem('internforge-user', JSON.stringify(updatedUser));
  };

  const handleAuthSuccess = (authenticatedUser: UserSession) => {
    setUser(authenticatedUser);
    localStorage.setItem('internforge-user', JSON.stringify(authenticatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('internforge-user');
    setCurrentTab('home');
    window.location.hash = '#/home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse Initial Hash routing on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const route = hash.replace(/^#\/?/, '');
        if (['home', 'programs', 'dashboard', 'track', 'certificate', 'admin', 'blog'].includes(route)) {
          setCurrentTab(route);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track Custom Trailing Cursor positioning
  useEffect(() => {
    const handleCursorMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleCursorMove);
    return () => window.removeEventListener('mousemove', handleCursorMove);
  }, []);

  const handleApplyNowAction = () => {
    setCurrentTab('programs');
    window.location.hash = '#/programs';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAction = () => {
    setCurrentTab('programs');
    window.location.hash = '#/programs';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe wrapper for scroll transitions
  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.98 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-cyber-bg text-white selection:bg-cyan-500/30 selection:text-white">
      {/* 2D Overlay Film Grain Visual Noise */}
      <div className="noise-bg" />

      {/* 1. Global Interactive Custom Cursor (Hidden on touch screens) */}
      <div className="hidden pointer-events-none fixed inset-0 z-[100] overflow-hidden md:block">
        <div
          ref={dotRef}
          className="fixed -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 z-[101]"
          style={{ transition: 'transform 0.05s ease-out', willChange: 'top, left' }}
        />
        <div
          ref={ringRef}
          className="fixed -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-cyan-400/40 opacity-75 z-[100] mix-blend-screen"
          style={{ transition: 'top 0.12s cubic-bezier(0.1, 0.8, 0.2, 1), left 0.12s cubic-bezier(0.1, 0.8, 0.2, 1)', willChange: 'top, left' }}
        />
      </div>

      {/* 2. Three.js Circuit/Neural Network Background behind all layout */}
      <ThreeBackground />

      {/* Professional Polish Background Grid & Ambient Curve Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-[2]">
        <div 
          className="absolute top-0 left-0 w-full h-full" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%)' 
          }} 
        />
        <svg className="absolute w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 Q 250 50 500 100 T 1024 100" fill="none" stroke="#06B6D4" strokeWidth="0.75" />
          <path d="M0 300 Q 300 350 600 300 T 1024 300" fill="none" stroke="#8B5CF6" strokeWidth="0.75" />
          <path d="M0 600 Q 400 550 800 600 T 1024 600" fill="none" stroke="#3B82F6" strokeWidth="0.75" />
        </svg>
      </div>

      {/* 3. Global Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.location.hash = `#/${tab}`;
        }}
        onApplyClick={handleApplyNowAction}
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />

      {/* 4. Tab Routing Page Switcher with smooth Exit/Entry scaling */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* LANDING / HERO PAGE */}
              <HeroSection onApplyClick={handleApplyNowAction} onExploreClick={handleExploreAction} />

              {/* Bento Grid Engineering Showcase section */}
              <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
                    <Cpu className="w-4 h-4 text-cyber-cyan" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-300 tracking-widest uppercase">LAB_SIMULATION_RIGS</span>
                  </div>
                  <h3 className="text-2xl sm:text-4.5xl font-display font-extrabold text-white tracking-tight leading-none mb-4">
                    Immersive Training Framework
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto font-sans">
                    Every week includes high-precision laboratory emulators executing embedded hardware logic models directly inside your terminal session.
                  </p>
                </div>

                {/* Bento layout grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Grid element 1 */}
                  <div className="md:col-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between group h-80 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-black text-lg text-white mb-2">Preemptive Kernel Systems</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Interface task hierarchies, design semaphore guards, & prevent thread priority inversions utilizing realistic FreeRTOS models.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold uppercase mt-6">
                      Read specs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Grid element 2 */}
                  <div className="md:col-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between group h-80 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 mb-4 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-black text-lg text-white mb-2">Robotic Joint Kinematics</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Calculate yaw curves, configure matrix joint parameters, and map path coordinates over highly realistic ROS 2 simulations.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 font-semibold uppercase mt-6">
                      Read specs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Grid element 3 */}
                  <div className="md:col-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between group h-80 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-black text-lg text-white mb-2">Edge Inferential quantization</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Compress neural networks via pruning algorithms, load TensorRT pipelines, & perform high-speed predictions.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 font-semibold uppercase mt-6">
                      Read specs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </section>

              {/* Dynamic Post-Login Portal Workspace Access Preview Showcase (Only visible to non-logged-in users) */}
              {!user && (
                <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
                  
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 tracking-widest uppercase">
                        ★ EXCLUSIVE PORTAL WORKSPACE PREVIEW
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-4.5xl font-display font-extrabold text-white tracking-tight leading-none mb-4">
                      Explore Your Student Portal Access
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto font-sans">
                      Wondering what access we provide once you log in? Here is an interactive, brief preview of the live candidate dashboard, structured roadmap track, and verification certifications.
                    </p>
                  </div>

                  {/* Glass Interactive Dashboard Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Sidebar Control Panel - Menu list */}
                    <div className="lg:col-span-4 space-y-3.5 text-left">
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('dashboard')}
                        className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none ${
                          activePreviewTab === 'dashboard'
                            ? 'bg-indigo-600/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                            : 'bg-black/25 border-white/5 hover:border-white/10 hover:bg-black/35'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border ${activePreviewTab === 'dashboard' ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300' : 'bg-white/5 border-transparent text-gray-400'}`}>
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                             1. Candidate Terminal Dashboard
                             <span className="text-[8px] font-mono px-1.5 py-0.5 bg-cyan-400/10 text-cyan-400 rounded">GATED</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                            Monitor persistent simulator telemetry, real-time Docker compile instances, accumulated domain experience points (XP), and active labs.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('track')}
                        className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none ${
                          activePreviewTab === 'track'
                            ? 'bg-emerald-600/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                            : 'bg-black/25 border-white/5 hover:border-white/10 hover:bg-black/35'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border ${activePreviewTab === 'track' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-white/5 border-transparent text-gray-400'}`}>
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                            2. Adaptive Milestones Track
                            <span className="text-[8px] font-mono px-1.5 py-0.5 bg-emerald-400/10 text-emerald-400 rounded">GATED</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                            A node-by-node structured sequence guiding you from elementary compiler configurations to advanced edge system integrations.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('certificate')}
                        className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none ${
                          activePreviewTab === 'certificate'
                            ? 'bg-amber-600/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                            : 'bg-black/25 border-white/5 hover:border-white/10 hover:bg-black/35'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border ${activePreviewTab === 'certificate' ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' : 'bg-white/5 border-transparent text-gray-400'}`}>
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                            3. Holographic Credentials Award
                            <span className="text-[8px] font-mono px-1.5 py-0.5 bg-amber-400/10 text-amber-400 rounded">GATED</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                            Generate high-contrast, personalized PDF vectors validating your industrial competence linked directly to database queries.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Right Canvas Dynamic Preview Box */}
                    <div className="lg:col-span-8 bg-[#0B0F19]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md min-h-[350px] shadow-2xl flex flex-col justify-between">
                      
                      {/* Gated Overlay Warning Banner */}
                      <div className="absolute top-0 left-0 right-0 py-2.5 px-4 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-b border-amber-500/15 backdrop-blur-md flex items-center justify-between z-20">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-black">
                            DEMO_ACCESS_MODE_STABILIZED // PRIVATE STUDENT ENCLAVE
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleLoginClick}
                          className="text-[9px] font-mono text-white bg-amber-500 hover:bg-amber-400 px-2.5 py-1 rounded font-bold uppercase transition-all cursor-pointer shadow-md"
                        >
                          Sign In To Activate Real Access &rarr;
                        </button>
                      </div>

                      {/* Display Selected Preview Mode */}
                      <div className="pt-10 h-full flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                          {activePreviewTab === 'dashboard' && (
                            <motion.div
                              key="demo-dash"
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25 }}
                              className="space-y-4 text-left"
                            >
                              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-300 font-bold">
                                    C
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-200">Rahul Sharma (Cadet #9204)</h4>
                                    <p className="text-[9px] text-indigo-400 font-mono uppercase">COHORT_LABS_MOCK_TELEMETRY</p>
                                  </div>
                                </div>
                                <div className="text-right font-mono text-[10px] text-gray-500">
                                  SYSTEM: SECURE_SANDBOX
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                <div className="bg-black/35 border border-white/5 rounded-xl p-3">
                                  <span className="block text-[8px] text-gray-500 font-mono uppercase">XP Level</span>
                                  <span className="text-lg font-bold text-indigo-400 font-mono">Level 3</span>
                                </div>
                                <div className="bg-black/35 border border-white/5 rounded-xl p-3">
                                  <span className="block text-[8px] text-gray-500 font-mono uppercase">Total XP accumulated</span>
                                  <span className="text-lg font-bold text-emerald-400 font-mono">420 XP</span>
                                </div>
                                <div className="bg-black/35 border border-white/5 rounded-xl p-3">
                                  <span className="block text-[8px] text-gray-500 font-mono uppercase">Simulation Labs cleared</span>
                                  <span className="text-lg font-bold text-cyan-400 font-mono">4 Completed</span>
                                </div>
                                <div className="bg-black/35 border border-white/5 rounded-xl p-3">
                                  <span className="block text-[8px] text-gray-500 font-mono uppercase">Active streak</span>
                                  <span className="text-lg font-bold text-amber-500 font-mono">5 Days 🔥</span>
                                </div>
                              </div>

                              {/* Interactive XP progress slider emulation */}
                              <div className="bg-black/45 border border-white/5 rounded-xl p-[11px] space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-gray-400">XP PROGRESSION FOR CURRENT LEVEL</span>
                                  <span className="text-indigo-300 font-bold">120 / 200 XP</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[60%]" />
                                </div>
                              </div>

                              <div className="bg-black/30 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-indigo-300/85">
                                <span className="text-amber-400 text-[10px] font-extrabold uppercase mr-1">[!] DEMO STATUS:</span>
                                Real-time dynamic compilation is disabled. Logging in initiates container orchestration that automatically updates these values.
                              </div>
                            </motion.div>
                          )}

                          {activePreviewTab === 'track' && (
                            <motion.div
                              key="demo-track"
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25 }}
                              className="space-y-4 text-left"
                            >
                              <div className="border-b border-white/5 pb-3">
                                <h4 className="text-xs font-bold text-gray-200">Adaptive Milestones Sequence Map</h4>
                                <p className="text-[9px] text-emerald-400 font-mono uppercase">PROGRESSION_NODE_TELEMETRY</p>
                              </div>

                              {/* Visually stunning timeline */}
                              <div className="space-y-3 pt-2 relative">
                                <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-white/5 z-0" />
                                
                                <div className="flex items-center gap-3.5 relative z-10">
                                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center text-xs font-bold font-sans">
                                    ✓
                                  </div>
                                  <div className="flex-1 bg-black/25 border border-white/5 rounded-xl p-2 px-3 flex items-center justify-between">
                                    <span className="text-xs text-white font-medium font-mono">Week 1: Preemptive Kernel Systems Boot</span>
                                    <span className="text-[8px] font-bold text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 rounded uppercase">CLEARED</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3.5 relative z-10">
                                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center text-xs font-bold animate-pulse font-sans">
                                    ▶
                                  </div>
                                  <div className="flex-1 bg-black/35 border border-cyan-500/25 rounded-xl p-2 px-3 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                    <span className="text-xs text-cyan-300 font-medium font-mono">Week 2: Robotic Joint Kinematics Config</span>
                                    <span className="text-[8px] font-bold text-cyan-400 font-mono px-2 py-0.5 bg-cyan-500/15 rounded uppercase">ACTIVE</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3.5 opacity-40 relative z-10">
                                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-gray-500 flex items-center justify-center text-xs font-bold font-sans">
                                    🔒
                                  </div>
                                  <div className="flex-1 bg-black/15 border border-transparent rounded-xl p-2 px-3 flex items-center justify-between">
                                    <span className="text-xs text-gray-400 font-mono">Week 3: Quantized TensorRT Pipelines</span>
                                    <span className="text-[8px] font-bold text-gray-500 font-mono px-2 py-0.5 bg-white/5 rounded uppercase">GATED</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-black/30 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-emerald-300/85">
                                <span className="text-amber-400 text-[10px] font-extrabold uppercase mr-1">[!] STRUCTURE INFO:</span>
                                Students unlock deep adaptive chapters automatically. Each node completed feeds data streams directly into the grading system.
                              </div>
                            </motion.div>
                          )}

                          {activePreviewTab === 'certificate' && (
                            <motion.div
                              key="demo-cert"
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25 }}
                              className="space-y-4 text-left"
                            >
                              <div className="border-b border-white/5 pb-3">
                                <h4 className="text-xs font-bold text-gray-200">Verified Web Vector Credentials</h4>
                                <p className="text-[9px] text-amber-400 font-mono uppercase">GRADUATE_CERTIFICATE_EMULATION</p>
                              </div>

                              {/* Realistic Holographic Certificate card mockup */}
                              <div className="bg-gradient-to-br from-[#121626] to-[#0A0D18] border border-amber-500/35 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg text-center">
                                {/* Subtle security vectors overlay background */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_50%)] pointer-events-none" />
                                
                                <div className="flex justify-between items-center z-10 text-[9px] text-amber-500 font-mono">
                                  <span>CREDENTIAL_ID: #IF-MOCK-89240</span>
                                  <span>INTERNFORGE DEPLOYMENT UNIT</span>
                                </div>

                                <div className="z-10 py-1.5">
                                  <h5 className="font-display font-bold text-sm tracking-wider text-white">RAHUL SHARMA</h5>
                                  <div className="w-16 h-[1.5px] bg-amber-500/40 mx-auto my-1" />
                                  <p className="text-[10px] text-gray-400 font-sans">
                                    Has successfully completed the advanced Systems and Embedded Robotics Simulator track.
                                  </p>
                                </div>

                                <div className="z-10 flex justify-between items-end">
                                  <div className="text-left font-mono text-[8px] text-gray-500">
                                    <span>ISSUED: MAY 23, 2026</span>
                                  </div>
                                  <div className="border border-amber-500/25 px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[8px] text-amber-400 font-bold uppercase tracking-wider">
                                    HOLO_SEALED ✓
                                  </div>
                                </div>
                              </div>

                              <div className="bg-black/30 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-amber-300/85">
                                <span className="text-amber-400 text-[10px] font-extrabold uppercase mr-1">[!] REAL VERIFICATION:</span>
                                Once cleared, certificates include instant share features and cryptographic verification references to share on LinkedIn or with recruiters.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>

                  </div>
                </section>
              )}

              {/* Student Profile Provisioning Benefits Segment (Business Logic Breakdown) */}
              <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none relative bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent rounded-3xl my-8">
                <div className="absolute inset-0 pointer-events-none" />
                
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-300 tracking-widest uppercase">COHORT_PROVISIONS</span>
                  </div>
                  <h3 className="text-2xl sm:text-4.5xl font-display font-extrabold text-white tracking-tight leading-none mb-4">
                    Why Create an Engineering Profile?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-450 max-w-2xl mx-auto font-sans">
                    Establishing your verified student identity compiles and updates continuous MongoDB telemetry. Here is exactly what you receive upon profile orchestration:
                  </p>
                </div>

                {/* Grid model breakdown representing real corporate-level perks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  
                  {/* Benefit A */}
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col justify-between h-64 hover:border-cyan-400/30 transition-all group duration-300">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mb-2">Workspace Terminals</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Spin up sandbox VM kernel simulations, compile test configurations (FreeRTOS, ROS 2), and synchronize joint parameters.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/50">PROVISION::TERMINAL_VM</span>
                  </div>

                  {/* Benefit B */}
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col justify-between h-64 hover:border-indigo-400/30 transition-all group duration-300">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 mb-4 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mb-2">MongoDB Continuous Telemetry</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Track lab completions, dynamic XP milestones, weekly chapters, and persistent badges secured under standard databases.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400/50">PROVISION::STATUS_STORE</span>
                  </div>

                  {/* Benefit C */}
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col justify-between h-64 hover:border-purple-400/30 transition-all group duration-300">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mb-2">5 Holo Achievement Seals</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Acrue micro-credentials as you clear embedded tests, validating real technical capabilities for recruiters.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400/50">PROVISION::HOLO_BADGES</span>
                  </div>

                  {/* Benefit D */}
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col justify-between h-64 hover:border-amber-400/30 transition-all group duration-300">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mb-2">Verified Vector Credentials</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        Custom-print high-contrast verification certificates linked with authentic database references immediately.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-500/50">PROVISION::PRINTABLE_CERT</span>
                  </div>

                  {/* Benefit E */}
                  <div className="rounded-2xl bg-black/40 border border-white/5 p-6 flex flex-col justify-between h-64 col-md-span-1 md:col-span-2 hover:border-emerald-400/30 transition-all group duration-300">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-bold text-base text-white mb-2">Direct 1-on-1 Mentor Gateway (Architect Calendar Sync)</h4>
                      <p className="text-xs text-gray-450 font-sans leading-relaxed">
                        Registered students gain immediate access to our expert mentors scheduling portal. Synchronize your calendar directly to book interactive system design loops and resume verification checks with elite team leads.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/50">PROVISION::OFFICE_HOURS_GATEWAY</span>
                  </div>

                </div>

                {/* Sub-CTA Register Button */}
                {!user && (
                  <div className="flex flex-col items-center justify-center pt-2">
                    <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest">
                      // READY TO JOIN 12,000+ CAFFEINE-UE COHORT CADETS IN DEPLOYMENT?
                    </p>
                    <GlowButton onClick={handleLoginClick} variant="gradient" className="w-full sm:w-72 h-12 text-xs">
                      Provision Engineering Profile Now &rarr;
                    </GlowButton>
                  </div>
                )}
              </section>

              {/* Infinite scrolling Testimonial Slider */}
              <section className="py-12">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase block mb-1">PROVEN BY ALUMNI</span>
                  <h3 className="font-display font-extrabold text-2xl text-white">Trust of India's Elite Engineering Cohorts</h3>
                </div>
                <TestimonialSlider />
              </section>

              {/* Bottom Landing CTA */}
              <section className="py-24 px-4 sm:px-6 lg:px-8 text-center relative select-none max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
                <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-4 tracking-tight leading-tight">
                  Ready to Engineer the Edge?
                </h3>
                <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto mb-8 font-sans">
                  Join 12,000+ students already deploying model compilers and RTOS kernels inside professional engineering tracks.
                </p>
                <GlowButton variant="gradient" onClick={handleApplyNowAction} className="h-13 w-full sm:w-56 text-sm">
                  Apply Today
                </GlowButton>
              </section>
            </motion.div>
          )}

          {currentTab === 'programs' && (
            <motion.div
              key="programs"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              {/* PROGRAMS CATALOG VIEW - ACCESSIBLE BEFORE LOGIN TO BROWSE PRICES */}
              <ProgramsView
                user={user}
                onProgressUpdate={handleProgressUpdate}
                onLoginClick={handleLoginClick}
                onNavigateToTab={(tabId) => {
                  setCurrentTab(tabId);
                  window.location.hash = `#/${tabId}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {currentTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              {/* STUDENT DASHBOARD VIEWS WITH GATE PROTECTION */}
              {user ? (
                <DashboardView
                  user={user}
                  onLoginClick={handleLoginClick}
                  onLogout={handleLogout}
                />
              ) : (
                <SecureGatedGate onLoginClick={handleLoginClick} tabLabel="Student Dashboard" />
              )}
            </motion.div>
          )}

          {currentTab === 'track' && (
            <motion.div
              key="track"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              {/* ROADMAP TRACK NODES WITH GATE PROTECTION */}
              {user ? (
                <TrackView
                  user={user}
                  onProgressUpdate={handleProgressUpdate}
                  onLoginClick={handleLoginClick}
                />
              ) : (
                <SecureGatedGate onLoginClick={handleLoginClick} tabLabel="Weekly Milestones Roadmap" />
              )}
            </motion.div>
          )}

          {currentTab === 'admin' && (
            <motion.div
              key="admin"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              {user && (
                user.email === 'tejasgowda.lk@gmail.com' || 
                user.email === 'admin@internforge.com' || 
                user.email === 'student@internforge.com' ||
                user.email === 'assistant.admin@internforge.com'
              ) ? (
                <AdminPanel onBackToClass={() => {
                  setCurrentTab('dashboard');
                  window.location.hash = '#/dashboard';
                }} />
              ) : (
                <div className="pt-32 pb-16 text-center select-none font-mono">
                  <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 mb-4 text-red-500">
                    🔒 GATE_PROTECTION
                  </div>
                  <h3 className="text-white font-display font-black uppercase text-sm tracking-wider">ROOT_ADMIN_ROLE_REQUIRED</h3>
                  <p className="text-xs text-gray-500 mt-2 font-sans">You must be logged in as admin to access this system panel.</p>
                </div>
              )}
            </motion.div>
          )}

          {currentTab === 'certificate' && (
            <motion.div
              key="certificate"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="pt-24 pb-16 px-4"
            >
              {/* CERTIFICATE PREVIEW EXP WITH GATE PROTECTION */}
              {user ? (
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                  <div className="text-center mb-10 select-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                      <Award className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-xs font-mono font-bold text-amber-300 tracking-widest uppercase">
                        Credential Verification Gateway
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-2">
                      Verified Program Certificate
                    </h2>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto font-sans">
                      Customize your award credentials and generate a high-contrast vector print directly to your computer profile.
                    </p>
                  </div>

                  <CertificateCard user={user} onProgressUpdate={handleProgressUpdate} />
                </div>
              ) : (
                <SecureGatedGate onLoginClick={handleLoginClick} tabLabel="Verified Program Certificates" />
              )}
            </motion.div>
          )}

          {currentTab === 'blog' && (
            <motion.div
              key="blog"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <BlogView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Bottom Credit Telemetry Indicator */}
      <footer className="relative z-10 py-10 border-t border-white/5 bg-black/40 text-center select-none font-sans mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <span>© 2026 InternForge Labs Inc. Immersive Engineering Internships.</span>
          <div className="flex gap-4 mt-4 sm:mt-0 font-mono text-[10px]">
            <span className="text-gray-600">SYS::STABLE_V2.5.0</span>
            <span className="text-gray-600">FPS::60_WEBGL_CALM</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Container Popup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
