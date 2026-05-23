import { useState } from 'react';
import { Program } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Brain, Cpu, Code2, Settings, Building2, Radio, Compass, Star, Clock, Sparkles, User, GraduationCap } from 'lucide-react';
import GlowButton from './GlowButton';

interface ProgramCardProps {
  program: Program;
  onEnrollClick: (program: Program) => void;
}

// Icon mapper for engineering domains
const getDomainIcon = (domain: string) => {
  switch (domain) {
    case 'Robotics':
      return <Bot className="w-5 h-5 text-cyan-400" />;
    case 'AI & ML':
      return <Brain className="w-5 h-5 text-purple-400" />;
    case 'Embedded':
      return <Cpu className="w-5 h-5 text-blue-400" />;
    case 'CSE':
      return <Code2 className="w-5 h-5 text-indigo-400" />;
    case 'Mechanical':
      return <Settings className="w-5 h-5 text-amber-400" />;
    case 'Civil':
      return <Building2 className="w-5 h-5 text-emerald-400" />;
    case 'IoT':
      return <Radio className="w-5 h-5 text-rose-400" />;
    default:
      return <Compass className="w-5 h-5 text-gray-400" />;
  }
};

// Colored dot for difficulty
const getDiffDot = (diff: string) => {
  switch (diff) {
    case 'Beginner':
      return 'bg-emerald-500 shadow-[0_0_8px_#10B981]';
    case 'Intermediate':
      return 'bg-amber-500 shadow-[0_0_8px_#F59E0B]';
    case 'Advanced':
      return 'bg-red-500 shadow-[0_0_8px_#EF4444]';
    default:
      return 'bg-gray-400';
  }
};

export default function ProgramCard({ program, onEnrollClick }: ProgramCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative flex flex-col justify-between h-[510px] rounded-2xl bg-cyber-card/45 border border-white/5 backdrop-blur-md p-6 overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:bg-cyber-card-bright/60 hover:shadow-[0_15px_45px_rgba(99,102,241,0.25)] select-none group"
    >
      {/* Absolute neon subtle corner gradient */}
      <span className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all duration-500" />
      <span className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/15 transition-all duration-500" />

      <div>
        {/* Header line with Domain icon + difficulty badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {getDomainIcon(program.domain)}
            <span className="text-xs font-semibold text-gray-200 tracking-wider font-display uppercase">{program.domain}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-black/35 px-2.5 py-1 rounded-full border border-white/5">
            <span className={`w-2 h-2 rounded-full ${getDiffDot(program.difficulty)}`} />
            <span className="font-medium">{program.difficulty}</span>
          </div>
        </div>

        {/* Title + description */}
        <h3 className="font-display font-semibold text-xl text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors duration-300 mb-2">
          {program.title}
        </h3>

        {/* Info stats (Duration & Rating) */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{program.rating} / 5.0</span>
          </div>
          {program.liveProject && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-emerald-400 text-[11px] font-semibold tracking-wider font-display uppercase">Pulsing Live</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed font-sans">
          {program.description}
        </p>

        {/* Tech stacks chips */}
        <div className="flex flex-wrap gap-1.5 mb-5 h-16 overflow-hidden">
          {program.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2.5 py-1 rounded bg-indigo-500/5 text-indigo-300/90 font-mono border border-indigo-500/10 hover:border-indigo-400/30 hover:bg-indigo-500/10 transition-colors duration-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        {/* Progress enrollment metrics (Static but detailed) */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5 font-sans">
            <span className="text-gray-400">Seat Occupancy Ratios</span>
            <span className="font-semibold text-indigo-300">{program.enrollmentPercentage}% filled</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${program.enrollmentPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
            />
          </div>
        </div>

        {/* Mentor Row */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={program.mentorAvatar}
              alt={program.mentorName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-indigo-400/30 transition-all duration-300"
            />
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-gray-200 truncate font-display">{program.mentorName}</span>
              <span className="block text-[10px] text-gray-500 truncate font-sans">{program.mentorRole}</span>
            </div>
          </div>
        </div>

        <GlowButton
          variant="outline"
          onClick={() => onEnrollClick(program)}
          className="w-full text-xs py-2 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/10 group-hover:text-white"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
          Enroll Program Track
        </GlowButton>
      </div>

      {/* Floating detail tooltip overlay on Hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute left-4 right-4 bottom-16 z-30 p-4 rounded-xl glass-card border-indigo-500/30 shadow-2xl pointer-events-none select-none"
          >
            <h4 className="text-xs font-semibold text-gray-300 tracking-widest font-display uppercase border-b border-white/10 pb-1.5 mb-2 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Curricula Outline
            </h4>
            <div className="space-y-1.5">
              {program.curriculum.slice(0, 3).map((line, i) => (
                <div key={i} className="flex gap-2 text-[11px] text-gray-300 leading-normal font-sans">
                  <span className="text-cyan-400 font-bold font-mono">▸</span>
                  <span className="line-clamp-2">{line}</span>
                </div>
              ))}
              {program.curriculum.length > 3 && (
                <div className="text-[10px] text-indigo-400 font-medium text-right italic font-sans pr-1">
                  + {program.curriculum.length - 3} more modules
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
