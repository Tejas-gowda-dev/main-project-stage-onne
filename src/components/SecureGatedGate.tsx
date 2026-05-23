import { motion } from 'motion/react';
import { Lock, ShieldCheck, CheckCircle2, Terminal, Cpu, Trophy, Award, Calendar, ChevronRight } from 'lucide-react';
import GlowButton from './GlowButton';

interface SecureGatedGateProps {
  onLoginClick: () => void;
  tabLabel: string;
}

export default function SecureGatedGate({ onLoginClick, tabLabel }: SecureGatedGateProps) {
  // 5 Strategic Core Business Perks (Profile setup benefits)
  const businessPerks = [
    {
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      title: "Full Sandbox Compiler Access",
      desc: "Instant authorization to spin up VM terminal nodes, compile source templates, & ship joint kinematic calibrations securely."
    },
    {
      icon: <Trophy className="w-5 h-5 text-indigo-400" />,
      title: "Real-Time IIT/BITS Cohort Leaderboard",
      desc: "Publish your customized academic metrics on the authenticated live leaderboards, syncing instantly to a dedicated MongoDB record."
    },
    {
      icon: <Award className="w-5 h-5 text-purple-400" />,
      title: "5 Cryptographic Skill Badge Seals",
      desc: "Acquire validated achievements (e.g. SLAM Operator, Kernel Master) displayed as high-contrast glowing holo badges."
    },
    {
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      title: "Direct 1-on-1 Mentor Office Gateway",
      desc: "Unlock personalized synchronization channels & schedule direct coordination calls with seasoned engineering architects."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: "Verified Printable Vector Credentials",
      desc: "Custom-print live-rendered, secure certificates carrying verified completion hash references upon clearing milestones."
    }
  ];

  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 font-sans relative select-none">
      
      {/* Decorative ambient background flares */}
      <span className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <span className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Main Gated Dialog Guard Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full rounded-3xl glass-card border border-indigo-500/20 shadow-2xl overflow-hidden p-6 sm:p-10 relative z-20"
      >
        {/* Top tech telemetry banner */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 font-mono text-[9px] text-gray-500 uppercase">
          <span className="flex items-center gap-1.5 text-cyber-cyan">
            <Terminal className="w-3.5 h-3.5" />
            SECURE_ROUTING_GUARD::ACCESS_DENIED
          </span>
          <span>GATE_VER_V2.5 // SECURE</span>
        </div>

        {/* Lock Headings */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] relative">
            <Lock className="w-6 h-6 animate-pulse" />
            <span className="absolute inset-0 rounded-2xl bg-indigo-400/20 animate-ping opacity-75" />
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-display font-extrabold text-white tracking-tight mb-2">
            Unlock {tabLabel} Gateway
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            This module requires an authenticated Student Credentials profile. Sign up to initialize your personal tracking ledger and claim active sandbox permissions.
          </p>
        </div>

        {/* Business Logic Block: Academic perks & deliverables */}
        <div className="max-w-4xl mx-auto bg-black/40 border border-white/5 rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase block mb-6 text-center sm:text-left">
            ★ Profile Provisioning Benefits & Deliverables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessPerks.map((perk, idx) => (
              <div key={idx} className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
                  {perk.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-gray-450 leading-relaxed font-sans">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic call to action trigger fields */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto relative z-10 w-full pt-2">
          <GlowButton onClick={onLoginClick} variant="gradient" className="w-full h-12 text-xs font-bold font-mono uppercase tracking-wider">
            Authorize Profile credentials &rarr;
          </GlowButton>
        </div>

      </motion.div>
    </div>
  );
}
