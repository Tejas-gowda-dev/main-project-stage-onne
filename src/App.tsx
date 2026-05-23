import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, Cpu, BookOpen, Briefcase, GraduationCap, CheckCircle, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

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

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Parse Initial Hash routing on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const route = hash.replace(/^#\/?/, '');
        if (['home', 'programs', 'dashboard', 'track', 'certificate'].includes(route)) {
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
              {/* PROGRAMS CATALOG VIEW */}
              <ProgramsView onEnrollClick={(p) => {
                // Instantly sync hash router and focus student tab to simulate enrollment!
                setCurrentTab('dashboard');
                window.location.hash = '#/dashboard';
                // scroll to topmost coordinate of student dashboard
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
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
              {/* STUDENT DASHBOARD VIEWS */}
              <DashboardView />
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
              {/* ROADMAP TRACK NODES */}
              <TrackView />
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
              {/* CERTIFICATE PREVIEW EXP */}
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

                <CertificateCard />
              </div>
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
    </div>
  );
}
