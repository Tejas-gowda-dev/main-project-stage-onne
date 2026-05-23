import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Calendar, Award, Star, Flame, Code, Brain, Target, BookOpen, Clock, Users, ArrowUpRight, CheckCircle, ChevronRight, Terminal, User } from 'lucide-react';
import { LEADERBOARD, BADGES, MENTOR_SESSIONS } from '../data';
import { Badge, LeaderboardUser, MentorSession } from '../types';
import GlowButton from './GlowButton';

export default function DashboardView() {
  const [userName, setUserName] = useState('ROHAN SHARMA');
  const [showBadgeCelebration, setShowBadgeCelebration] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState('19:09:20');
  const [dateStr, setDateStr] = useState('Friday, May 22, 2026');

  // Time ticker to sync with global local time 2026-05-22
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Adjust to resemble 2026
      now.setFullYear(2026);
      now.setMonth(4); // May is 4
      now.setDate(22);
      
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quotes rotation
  const quotes = [
    "Compile error is merely an invitation to build closer register controls.",
    "First, solve the physics kinematic; then, write the ROS 2 node mapping.",
    "Hardware and software are twin splined shafts; alignment creates the speed torque.",
    "A tight preemptive task scheduling is worth a thousand bare-metal interrupts."
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(quoteTimer);
  }, []);

  // Custom SVG Radar trigonometry variables
  // Axes: SLAM, RTOS, DeepML, SysDesign, DSA, Comms
  const radarMetrics = [
    { label: 'Robotics SLAM', value: 85, angle: 0 },
    { label: 'Embedded RTOS', value: 90, angle: 60 },
    { label: 'Deep Learning', value: 75, angle: 120 },
    { label: 'System Design', value: 80, angle: 180 },
    { label: 'Core DSA', value: 70, angle: 240 },
    { label: 'Team Comms', value: 88, angle: 300 },
  ];

  const radarCenter = 120;
  const radarMaxRadius = 80;

  // Compute point coordinates (x, y) helper
  const getRadarCoords = (angleDeg: number, valPercent: number) => {
    const angleRad = (angleDeg * Math.PI) / 180 - Math.PI / 2;
    const distance = (valPercent / 100) * radarMaxRadius;
    const x = radarCenter + distance * Math.cos(angleRad);
    const y = radarCenter + distance * Math.sin(angleRad);
    return { x, y };
  };

  // Generate web polygon coordinates
  const radarPolygonpoints = radarMetrics
    .map((m) => {
      const { x, y } = getRadarCoords(m.angle, m.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Video Chapter lectures
  const currentChapterList = [
    { id: 'ch1', title: 'Calculus of Differential Steering geometry', duration: '14 min', checked: true },
    { id: 'ch2', title: 'Configuring URDF Physics and Joint constraints', duration: '28 min', checked: true },
    { id: 'ch3', title: 'Subscribing custom float arrays to ROS 2 topic', duration: '22 min', checked: false },
    { id: 'ch4', title: 'Synchronized callback executors and thread block limits', duration: '19 min', checked: false },
  ];

  // Grid dates arrays for streak
  // Create 12 columns representing weekly boxes for contribution heatmap (12 weeks of internship)
  const heatmapCols = Array.from({ length: 15 }, (_, colIdx) => {
    return Array.from({ length: 7 }, (_, rowIdx) => {
      // Simulate random activity colors: blank, light green, mid green, dark green
      const rand = Math.random();
      const level = rand < 0.35 ? 0 : rand < 0.65 ? 1 : rand < 0.85 ? 2 : 3;
      return { level, id: `${colIdx}-${rowIdx}` };
    });
  });

  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans select-none">
      
      {/* Dynamic Celebration Overlay for Badges */}
      <AnimatePresence>
        {showBadgeCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBadgeCelebration(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="max-w-md w-full rounded-2xl glass-card border-amber-500/30 p-8 text-center flex flex-col items-center relative"
            >
              <div className="absolute top-2 right-4 text-amber-500 font-mono text-[9px]">BURST_CELEB_SYS</div>
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-bounce">
                <Award className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-white mb-2">Achievement Unlocked!</h3>
              <p className="text-amber-300 font-mono font-bold text-xs tracking-wider uppercase mb-3">"{showBadgeCelebration}"</p>
              <p className="text-sm text-gray-400 mb-6">You have earned an extra +250 XP towards your cohort rank ranking parameters!</p>
              <GlowButton variant="purple" className="text-xs h-10 px-8">Acknowledge telemetry</GlowButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Console Welcome Row */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Terminal className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyber-cyan tracking-widest uppercase">
              console.student_status: active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4.5xl font-display font-extrabold text-white tracking-tight leading-none mb-2">
            Welcome back, {userName} 👋
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-400 italic flex items-center gap-2 uppercase tracking-wide font-mono bg-white/5 px-3 py-1 rounded border border-white/5 max-w-max">
            <span className="text-cyber-green animate-pulse">●</span> " {quotes[quoteIdx]} "
          </p>
        </div>

        {/* Global Date Clock telemetry panel */}
        <div className="lg:col-span-4 bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between text-right backdrop-blur-md">
          <div className="text-left">
            <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">COHORT CALENDAR</span>
            <span className="block text-xs font-semibold text-gray-200">{dateStr}</span>
          </div>
          <div className="border-l border-white/5 pl-4 ml-4">
            <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">LOCAL COORD TIME</span>
            <span className="block text-xl font-mono font-bold text-cyber-cyan tracking-wider tabular-nums neon-text-cyan">{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Top Level Metric Dashboard cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Metric 1 Completion Ring SVG */}
        <div className="rounded-2xl glass-card p-6 flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono font-bold text-gray-500 tracking-wider uppercase mb-1">Track Completion</span>
            <span className="block font-display font-bold text-3xl text-white">42%</span>
            <span className="block text-[11px] text-gray-400 mt-1">2 of 5 modules cleared</span>
          </div>

          {/* SVG Circular Ring inside Dashboard */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Background vector circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" className="stroke-white/5 fill-transparent" strokeWidth="4" />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-cyan-400 fill-transparent"
                strokeWidth="4"
                strokeDasharray="163"
                initial={{ strokeDashoffset: 163 }}
                animate={{ strokeDashoffset: 163 * (1 - 0.42) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute font-mono text-xs text-cyan-400 font-bold">42%</div>
          </div>
        </div>

        {/* Metric 2 Done tasks */}
        <div className="rounded-2xl glass-card p-6 flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono font-bold text-gray-500 tracking-wider uppercase mb-1">Lab Submissions</span>
            <span className="block font-display font-bold text-3xl text-gradient">14 <span className="text-lg text-gray-500">/ 20</span></span>
            <span className="block text-[11px] text-gray-400 mt-1">Next due: Tomorrow</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shadow-lg text-indigo-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 Badges */}
        <div className="rounded-2xl glass-card p-6 flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono font-bold text-gray-500 tracking-wider uppercase mb-1">Security Badges</span>
            <span className="block font-display font-bold text-3xl text-purple-400">03 <span className="text-lg text-gray-500">/ 05</span></span>
            <span className="block text-[11px] text-gray-400 mt-1">Holo seals active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shadow-lg text-purple-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 Streak */}
        <div className="rounded-2xl glass-card p-6 flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[10px] font-mono font-bold text-gray-500 tracking-wider uppercase mb-1">Daily Streak Code</span>
            <span className="block font-display font-bold text-3xl text-amber-500 flex items-center gap-1.5">
              15 <span className="text-sm font-sans font-normal text-gray-300">Days</span>
            </span>
            <span className="block text-[11px] text-gray-400 mt-1">XP Bonus multiplier: 1.5x</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shadow-lg text-amber-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Grid Layout section split (Left: Current course / Skills, Right: Streaks / Leadeboards...) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CHAPTER & SKILL RADAR TELEMETRY */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Lecture Media Player & Chapter tasks Widget */}
          <div className="rounded-2xl glass-card overflow-hidden shadow-2xl relative border-white/5">
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-sm text-gray-200">Active Lab Lesson Module</h3>
              </div>
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 py-0.5 px-2 rounded">
                UNIT_2::STEADY_ROVER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Media simulated cover */}
              <div className="md:col-span-5 aspect-video md:aspect-auto bg-black/45 relative flex items-center justify-center group overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80"
                  alt="Lesson simulator"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center cursor-none transition-all duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Play className="w-5 h-5 fill-current text-cyan-400 ml-1" />
                  </div>
                  <span className="block text-[11px] text-gray-300 font-medium font-sans mt-3">Play 28-min Lecture</span>
                </div>
              </div>

              {/* Course Chapter Outline checks */}
              <div className="md:col-span-7 p-6 space-y-4">
                <div className="min-w-0">
                  <span className="text-[10px] text-cyber-cyan font-semibold uppercase tracking-wider">ROS2 Kinematics Basics</span>
                  <h4 className="font-display font-bold text-lg text-white truncate mt-0.5">Calculus of Differential Vector Joints</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1">Instructor: Dr. Arjun Mehta • 4 Modules</p>
                </div>

                <div className="space-y-2.5">
                  {currentChapterList.map((ch) => (
                    <div
                      key={ch.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors font-sans ${
                        ch.checked
                          ? 'bg-cyber-green/5 border-cyber-green/15 text-gray-200'
                          : 'bg-black/25 border-transparent text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          ch.checked
                            ? 'bg-cyber-green/20 border-cyber-green/45 text-cyber-green'
                            : 'border-gray-600'
                        }`}>
                          {ch.checked && <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />}
                        </div>
                        <span className="font-medium truncate">{ch.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500 shrink-0 ml-2">{ch.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges grid box */}
          <div className="rounded-2xl glass-card p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-display font-bold text-md text-white">Cohort Unlocked Badges</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">HOVER_BURST_PRO</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => badge.unlocked && setShowBadgeCelebration(badge.name)}
                  className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all duration-300 relative group cursor-none ${
                    badge.unlocked
                      ? 'bg-cyber-card/75 border-white/10 hover:border-indigo-500/40 hover:bg-cyber-card-bright/80 hover:shadow-[0_4px_15px_rgba(99,102,241,0.2)]'
                      : 'bg-black/30 border-dashed border-white/5 opacity-40'
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-110 shadow-inner"
                    style={{
                      backgroundColor: badge.unlocked ? `${badge.color}15` : '#111827',
                      border: badge.unlocked ? `1px solid ${badge.color}35` : '1px solid rgba(255,255,255,0.05)',
                      color: badge.unlocked ? badge.color : '#6B7280'
                    }}
                  >
                    {/* Render corresponding mock visual icon */}
                    <Code className="w-5 h-5" />
                  </div>
                  
                  <span className="block font-display text-xs font-semibold text-gray-200 truncate w-full">{badge.name}</span>
                  <span className="block text-[8px] text-gray-500 mt-0.5 leading-tight">{badge.unlocked ? `${badge.xpValue} XP` : 'LOCKED'}</span>

                  {/* Absolute locked pad indicator overlay */}
                  {!badge.unlocked && (
                    <span className="absolute inset-0 bg-transparent flex items-center justify-center rounded-xl" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GitHub-style Learning Contribution Heatmap matrix */}
          <div className="rounded-2xl glass-card p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 text-sans">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-md text-white">Continuous Streak Matrix</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">15_DAY_FIRE_RUN</span>
            </div>

            {/* Simulated Grid list */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1.5 min-w-[500px]">
                {heatmapCols.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1.5">
                    {col.map((box) => {
                      // Color depth helper
                      let colorClass = 'bg-white/5';
                      if (box.level === 1) colorClass = 'bg-indigo-900/40 border border-indigo-500/20';
                      if (box.level === 2) colorClass = 'bg-indigo-600/60 border border-indigo-400/40';
                      if (box.level === 3) colorClass = 'bg-cyan-400 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]';

                      return (
                        <div
                          key={box.id}
                          className={`w-6 h-6 rounded-md hover:scale-110 hover:border-white/30 transition-all duration-150 ${colorClass}`}
                          title="Active labs submission"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5 pt-3.5 mt-4">
              <span>Weeks 1 (Foundation)</span>
              <span>Week 6 (Specialization Modules)</span>
              <span>Week 12 (Global Capstone)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LEADERSHIP RING & UPCOMING LIVE SESSIONS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Custom SVG Radar chart widget */}
          <div className="rounded-2xl glass-card p-5 shadow-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-1.5 border-b border-white/5 font-sans">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyber-cyan animate-pulse" />
                <h3 className="font-display font-bold text-sm text-gray-200">Engineering Radar</h3>
              </div>
              <span className="text-[9px] text-[indigo-300] font-mono leading-none font-bold uppercase">IFL_BI_METRICS</span>
            </div>

            {/* Custom Trigonometric SVG Radar */}
            <div className="relative w-full flex justify-center py-2">
              <svg width="240" height="240" className="opacity-95">
                {/* Draw concentric circular web levels */}
                {[20, 40, 60, 80].map((radius, i) => (
                  <circle
                    key={i}
                    cx={radarCenter}
                    cy={radarCenter}
                    r={radius}
                    className="stroke-white/5 fill-transparent"
                    strokeWidth="1"
                  />
                ))}

                {/* Draw spokes */}
                {radarMetrics.map((axis, i) => {
                  const end = getRadarCoords(axis.angle, 100);
                  return (
                    <line
                      key={i}
                      x1={radarCenter}
                      y1={radarCenter}
                      x2={end.x}
                      y2={end.y}
                      className="stroke-white/10"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Plot coordinates polygon */}
                <polygon
                  points={radarPolygonpoints}
                  className="fill-indigo-500/20 stroke-cyan-400"
                  strokeWidth="2"
                />

                {/* Plot small joint coordinate points */}
                {radarMetrics.map((axis, i) => {
                  const pt = getRadarCoords(axis.angle, axis.value);
                  return (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      className="fill-cyan-400 stroke-cyan-200 stroke-1"
                    />
                  );
                })}

                {/* Axis Labels */}
                {radarMetrics.map((axis, i) => {
                  // Push labels slightly outwards for clarity
                  const pt = getRadarCoords(axis.angle, 118);
                  return (
                    <text
                      key={i}
                      x={pt.x}
                      y={pt.y}
                      className="fill-gray-400 font-mono font-semibold"
                      fontSize="9"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {axis.label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Mentoring Timeline calendars */}
          <div className="rounded-2xl glass-card p-5 shadow-xl relative border-white/5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 font-sans">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h3 className="font-display font-bold text-sm text-gray-200">Upcoming Live Sessions</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">COUNTDOWN_SEC</span>
            </div>

            <div className="space-y-4">
              {MENTOR_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl bg-black/35 border border-white/5 hover:border-indigo-500/30 transition-colors relative group font-sans"
                >
                  <span className="absolute top-2 right-3 font-mono text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold">
                    + {session.xpAward} XP
                  </span>

                  <h4 className="font-display font-bold text-white text-xs leading-snug pr-12 group-hover:text-indigo-300 transition-colors">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>Host: {session.mentor}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[10px] border-t border-white/5 pt-2 text-gray-500">
                    <span className="font-mono text-cyan-400/80 font-bold">{session.time}</span>
                    <span className="cursor-none text-indigo-400 hover:text-white transition-colors flex items-center gap-0.5">
                      RSVP Channel <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Leaderboard Widget */}
          <div className="rounded-2xl glass-card p-5 shadow-xl relative border-white/5 font-sans">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-gray-200">Cohort Leadership Rank</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">TOP_GRID_L_5</span>
            </div>

            <div className="space-y-2.5">
              {LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                    item.isCurrentUser
                      ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border-indigo-400/40 shadow-md shadow-indigo-500/5 hover:border-indigo-400/50'
                      : 'bg-black/25 border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : item.rank === 2
                        ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30'
                        : item.isCurrentUser
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {item.rank}
                    </span>

                    <img
                      src={item.avatar}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-white/5 shrink-0"
                    />

                    <div className="min-w-0">
                      <span className={`block text-xs font-bold truncate ${item.isCurrentUser ? 'text-white' : 'text-gray-200'}`}>
                        {item.name}
                      </span>
                      <span className="block text-[10px] text-gray-500 truncate">{item.college}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-black text-indigo-300 shrink-0 select-all">
                    {item.xp} <span className="text-[9px] text-gray-500 font-normal">XP</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
