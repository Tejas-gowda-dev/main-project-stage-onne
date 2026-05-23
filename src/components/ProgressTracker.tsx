import { motion } from 'motion/react';
import { Target, Trophy, Clock, Star, Flame } from 'lucide-react';

interface ProgressTrackerProps {
  percentage?: number;
  tasksDone?: number;
  totalTasks?: number;
  badgesEarned?: number;
  totalBadges?: number;
  xpPoints?: number;
  title?: string;
}

export default function ProgressTracker({
  percentage = 42,
  tasksDone = 14,
  totalTasks = 20,
  badgesEarned = 3,
  totalBadges = 5,
  xpPoints = 4150,
  title = "Active Enrollment Telemetry Tracker"
}: ProgressTrackerProps) {
  return (
    <div className="w-full rounded-2xl glass-card p-6 shadow-xl relative border-white/5 font-sans">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-display flex items-center gap-1.5">
          <Target className="w-4 h-4 text-cyber-cyan animate-pulse" /> {title}
        </h4>
        <span className="text-[9px] text-gray-500 font-mono">SYS_PROGRESS_A1</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Progress Bar Side */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-gray-400">Total Curricula Completion Rate</span>
              <span className="text-cyber-cyan font-bold font-mono">{percentage}% COMPLETE</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>

          {/* Quick milestone labels */}
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>START (W_1)</span>
            <span>MIDWAY (W_6)</span>
            <span>CAPSTONE (W_12)</span>
          </div>
        </div>

        {/* Small stats cluster */}
        <div className="md:col-span-4 grid grid-cols-3 gap-3">
          <div className="p-2 rounded-xl bg-black/25 border border-white/5 text-center flex flex-col justify-center items-center">
            <Trophy className="w-4 h-4 text-amber-500 mb-1" />
            <span className="block font-mono font-bold text-xs text-white">{xpPoints}</span>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mt-0.5">XP</span>
          </div>

          <div className="p-2 rounded-xl bg-black/25 border border-white/5 text-center flex flex-col justify-center items-center">
            <Clock className="w-4 h-4 text-cyber-blue mb-1" />
            <span className="block font-mono font-bold text-xs text-white">{tasksDone}/{totalTasks}</span>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mt-0.5">Labs</span>
          </div>

          <div className="p-2 rounded-xl bg-black/25 border border-white/5 text-center flex flex-col justify-center items-center">
            <Star className="w-4 h-4 text-purple-400 mb-1" />
            <span className="block font-mono font-bold text-xs text-white">{badgesEarned}/{totalBadges}</span>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mt-0.5">Seals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
