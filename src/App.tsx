import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award } from 'lucide-react';

import { UserSession } from './types';
import AuthModal from './components/AuthModal';

// Import Custom Core Components
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import CertificateCard from './components/CertificateCard';

// Import Tab Views
import ProgramsView from './components/ProgramsView';
import DashboardView from './components/DashboardView';
import TrackView from './components/TrackView';
import GlowButton from './components/GlowButton';
import SecureGatedGate from './components/SecureGatedGate';
import AdminPanel from './components/AdminPanel';
import BlogView from './components/BlogView';
import HomeView from './components/HomeView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
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

  // Dynamic SEO Metadata updates & Google-compliant JSON-LD Structured Data Schema injections
  useEffect(() => {
    let titleStr = "InternForge | Premium Immersive Engineering Internship Labs";
    let descStr = "Accelerate your engineering profession with InternForge. Access advanced sandbox simulation laboratory sequences in Autonomous Robotics, Edge ML, RTOS Firmware, and Distributed Systems with verified on-chain completion credentials.";
    
    switch (currentTab) {
      case 'home':
        titleStr = "InternForge | Premium Immersive Engineering Internship Labs";
        break;
      case 'programs':
        titleStr = "Explore Programs & Curriculums | InternForge Specializations";
        descStr = "Apply for structured cohorts including Autonomous Robotics, Edge ML compressions, Embedded RTOS firmware development, and Next.js scale system design.";
        break;
      case 'dashboard':
        titleStr = `Dashboard | ${user ? user.name : 'Candidate Arena'} | InternForge`;
        descStr = "Access your engineering portal. Run simulated tests, preview persistent experience metrics (XP), and verify compiler-level progress reports.";
        break;
      case 'track':
        titleStr = "Engineering Path & Weekly Milestones | InternForge";
        descStr = "Track detailed laboratory challenges, monitor firmware test suites, and coordinate graduation timeline sequences.";
        break;
      case 'certificate':
        titleStr = "Verified Credentials & Graduation Certificates | InternForge";
        descStr = "Verify corporate-grade cryptographic micro-credentials, download high-definition printable PDFs, and share instant verified references with recruiters.";
        break;
      case 'admin':
        titleStr = "System Telemetry & Student Audit Panel | InternForge System Console";
        descStr = "Verify enrolled user states, fast-track candidate graduations, reset specialized track parameters, and inspect simulated payment methods.";
        break;
      case 'blog':
        titleStr = "Educational Insights & Tech Trends | InternForge Blog";
        descStr = "Read original engineering whitepapers, real-time RTOS scheduling analyses, autonomous navigation tips, and career advancement blueprints.";
        break;
    }
    
    // Update Document Title
    document.title = titleStr;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descStr);
    }

    // Set JSON-LD Schema to boost SEO categorization (Org, Brand & Course)
    const existingSchema = document.getElementById('internforge-jsonld');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://internforge.com/#organization",
          "name": "InternForge",
          "url": "https://internforge.com",
          "logo": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
          "description": "High-fidelity laboratory simulators enabling students to execute professional hardware firmware & cloud compilers in browser environments.",
          "sameAs": [
            "https://github.com/internforge",
            "https://linkedin.com/company/internforge"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://internforge.com/#website",
          "url": "https://internforge.com",
          "name": "InternForge Labs",
          "publisher": { "@id": "https://internforge.com/#organization" }
        },
        {
          "@type": "FAQPage",
          "@id": "https://internforge.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is InternForge and how does the hands-on engineering internship simulation work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "InternForge offers realistic, cloud-native sandbox environments for hardware-firmware and complex system designs. Students execute compiler scripts, design joint kinematics, and configure preemptive operating systems in-browser."
              }
            },
            {
              "@type": "Question",
              "name": "Are the graduation certificates verified and recognized by recruiters?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, every certificate has an associated unique ID and cryptographic authentication hash that can be instantly printed in high-fidelity PDF format or referenced on LinkedIn to confirm micro-credit completions."
              }
            },
            {
              "@type": "Question",
              "name": "Do we need physical development boards like Arduino or Raspberry Pi?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, all laboratory sequences run on custom high-fidelity browser emulators. You write standard hardware routines, load configurations, and see live virtual outputs directly inside your student terminal workspace."
              }
            }
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'internforge-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const added = document.getElementById('internforge-jsonld');
      if (added) added.remove();
    };
  }, [currentTab, user]);

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
              <HomeView
                user={user}
                onApplyClick={handleApplyNowAction}
                onExploreClick={handleExploreAction}
                onLoginClick={handleLoginClick}
              />
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
