import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, ChevronRight, GraduationCap, Award, Map, BarChart4, LayoutList, Rocket } from 'lucide-react';
import GlowButton from './GlowButton';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onApplyClick: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onApplyClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Monitor window coordinates to trigger shrink and shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Rocket className="w-4 h-4 text-cyan-400" /> },
    { id: 'programs', label: 'Programs', icon: <LayoutList className="w-4 h-4 text-indigo-400" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart4 className="w-4 h-4 text-purple-400" /> },
    { id: 'track', label: 'Track', icon: <Map className="w-4 h-4 text-emerald-400" /> },
    { id: 'certificate', label: 'Certificate', icon: <Award className="w-4 h-4 text-amber-400" /> },
  ] as const;

  const navigateTo = (tabId: string) => {
    setCurrentTab(tabId);
    window.location.hash = `#/${tabId}`;
    setIsMobileOpen(false);
    // Smooth scroll back to top of the dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-cyber-bg/85 backdrop-blur-xl border-b border-indigo-500/15 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]'
          : 'py-5 bg-transparent border-b border-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand with a circuit grid spark SVG icon */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-none select-none group"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-transparent group-hover:via-white transition-all duration-300">
                InternForge
              </span>
              <span className="block text-[9px] text-cyber-cyan font-mono tracking-widest font-semibold uppercase -mt-1">
                Engineering Labs
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/5 p-1 rounded-xl backdrop-blur-md">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wider font-display transition-all duration-300 flex items-center gap-2 cursor-none select-none ${
                    active 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-indigo-500/15 border border-indigo-500/30 rounded-lg -z-10 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Side action apply CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigateTo('dashboard')}
              className="text-xs font-mono text-gray-400 hover:text-white transition-colors duration-300 font-semibold cursor-none flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              console.login
            </button>
            <GlowButton variant="gradient" onClick={onApplyClick} className="text-xs py-2 px-5">
              Apply Now
            </GlowButton>
          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-none"
            >
              {isMobileOpen ? <X className="w-6 h-6 animate-pulse" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Curtain Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden absolute top-full left-0 right-0 bg-cyber-bg/95 border-b border-indigo-500/10 backdrop-blur-2xl py-6 px-4 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2.5">
              {navItems.map((item, idx) => {
                const active = currentTab === item.id;
                return (
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-200 text-left cursor-none ${
                      active
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-black/40">
                      {item.icon}
                    </div>
                    <span className="font-display font-medium text-sm">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => navigateTo('dashboard')}
                className="w-full justify-center p-3 text-center text-sm font-mono text-gray-400 hover:text-white transition-colors font-semibold flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-cyber-cyan" />
                Student Login
              </button>
              <GlowButton variant="gradient" onClick={onApplyClick} className="w-full text-sm">
                Apply Now (Standard Entry)
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
