import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ROADMAP_NODES } from '../data';
import { RoadmapNode, UserSession } from '../types';
import { Lock, Check, Play, Circle, Calendar, Trophy, ChevronRight, X, Sparkles, BookOpen, Layers, Terminal as TermIcon, ShieldEllipsis, AlertCircle } from 'lucide-react';
import GlowButton from './GlowButton';

interface TrackViewProps {
  user: UserSession | null;
  onProgressUpdate: (updatedUser: UserSession) => void;
  onLoginClick: () => void;
}

export default function TrackView({ user, onProgressUpdate, onLoginClick }: TrackViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const [isSimulatingTerminal, setIsSimulatingTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [simSuccess, setSimSuccess] = useState(false);

  // Fallback guest user session
  const activeUser = user || {
    id: 'guest-user',
    email: 'student@internforge.com',
    name: 'Guest Cadet',
    level: 1,
    xp: 250,
    streak: 1,
    completedNodes: [] as string[],
    activeNodeId: 'w1-2',
    badges: ['b1'],
    labsCompleted: 0
  };

  const getDynamicNodes = (): RoadmapNode[] => {
    const completedSet = new Set(activeUser.completedNodes);
    let nextFound = false;
    return ROADMAP_NODES.map((node) => {
      if (completedSet.has(node.id)) {
        return { ...node, status: 'completed' };
      }
      if (!nextFound) {
        nextFound = true;
        return { ...node, status: 'in-progress' };
      }
      return { ...node, status: 'locked' };
    });
  };

  const dynamicNodes = getDynamicNodes();
  const selectedNode = dynamicNodes.find(n => n.id === selectedNodeId) || null;

  // SVG node coordinates for a curved serpentine cyber roadmap line (responsive offsets)
  const responsiveCoordinates = [
    { x: 120, y: 60 },   // Week 1-2
    { x: 340, y: 150 },  // Week 3-5
    { x: 180, y: 280 },  // Week 6-8
    { x: 400, y: 390 },  // Week 9-10
    { x: 260, y: 520 },  // Week 11-12
  ];

  // Helper colors
  const getNodeColor = (status: 'locked' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'in-progress':
        return 'border-cyan-400 bg-cyan-400/15 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse';
      case 'locked':
        return 'border-gray-700 bg-gray-950 text-gray-500 opacity-60';
      default:
        return 'border-gray-500';
    }
  };

  // Generate SVG path string (curved spline line linking coordinates)
  const generatePathString = () => {
    return responsiveCoordinates
      .map((pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = responsiveCoordinates[i - 1];
        // Symmetrical cubic curver control points
        const cpY = (prev.y + pt.y) / 2;
        return `C ${prev.x} ${cpY}, ${pt.x} ${cpY}, ${pt.x} ${pt.y}`;
      })
      .join(' ');
  };

  const runTerminalSimulation = async () => {
    if (!selectedNode) return;
    setIsSimulatingTerminal(true);
    setSimSuccess(false);
    setTerminalLogs([]);

    const steps = [
      `[SYS_INIT] Spinning up sandboxed virtual kernel environment...`,
      `[NET_PROBE] Connected securely to InternForge DB pipeline at port 3000`,
      `[LOAD_SOURCE] Parsing and verifying source: "${selectedNode.projects[0]}"...`,
      `[COMPILE] Running standard compiler: gcc-embedded v12.2.0 -O3 -Wall`,
      `[TEST_RUN] Exercising joint constraint validation test cases [1/3]... PACKED`,
      `[TEST_RUN] Testing digital filtration signal thresholds [2/3]... SUCCESS`,
      `[TEST_RUN] Matching target telemetry coordinates check [3/3]... PASSED`,
      `[SYNC_DB] Shipping completed status update to MongoDB backend server...`,
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
      setTerminalLogs(prev => [...prev, steps[i]]);
    }

    try {
      const nextCompletedNodes = [...activeUser.completedNodes];
      if (!nextCompletedNodes.includes(selectedNode.id)) {
        nextCompletedNodes.push(selectedNode.id);
      }

      const res = await fetch("/api/tracker/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser.id,
          completedNodes: nextCompletedNodes,
          activeNodeId: selectedNode.id === 'w1-2' ? 'w3-5' : selectedNode.id === 'w3-5' ? 'w6-8' : selectedNode.id === 'w6-8' ? 'w9-10' : 'w11-12',
          xpGained: selectedNode.xpReward,
          labsCompleted: activeUser.labsCompleted + 1,
          badgeAwarded: selectedNode.id === 'w3-5' ? 'b4' : undefined
        })
      });

      if (!res.ok) {
        throw new Error("Unable to synchronize progress with backend.");
      }

      const data = await res.json();
      setTerminalLogs(prev => [...prev, `[SUCCESS] Database synchronized successfully! +${selectedNode.xpReward} XP awarded.`]);
      setSimSuccess(true);
      if (onProgressUpdate && data.user) {
        onProgressUpdate(data.user);
      }
    } catch (err: any) {
      setTerminalLogs(prev => [...prev, `[WARNING] Persistent connection unavailable. Progress saved locally in fallback memory storage.`]);
      // Local fallback in case guest or network is slow
      const fallbackUser: UserSession = {
        ...activeUser,
        completedNodes: [...activeUser.completedNodes, selectedNode.id],
        xp: activeUser.xp + selectedNode.xpReward,
        labsCompleted: activeUser.labsCompleted + 1,
        badges: selectedNode.id === 'w3-5' ? [...activeUser.badges, 'b4'] : activeUser.badges
      };
      setSimSuccess(true);
      onProgressUpdate(fallbackUser);
    }
  };


  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans relative select-none">
      
      {/* Title block */}
      <div className="text-center md:text-left mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Layers className="w-4 h-4 text-cyber-green animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold text-cyber-green tracking-widest uppercase">
            Curriculum Path Map
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
          Interactive Learning Track
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-sans">
          Your path is modeled as an interactive state spline. Click nodes to run diagnostic curriculum drawers or trigger code submissions.
        </p>
      </div>

      {/* Horizontal timeline weeks slider (Hover list reveal) */}
      <div className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
          <Calendar className="w-4 h-4 text-cyber-cyan" />
          <span>Interactive Week Timeline</span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 max-w-full scrollbar-thin">
          {dynamicNodes.map((node) => (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredWeek(node.id)}
              onMouseLeave={() => setHoveredWeek(null)}
              onClick={() => setSelectedNodeId(node.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 border whitespace-nowrap select-none ${
                node.status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : node.status === 'in-progress'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : 'bg-transparent border-transparent text-gray-400'
              }`}
            >
              <span className="font-semibold">{node.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap main board split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[580px]">
        
        {/* SERPENTINE ROADMAP SPLINE CANVAS COLUMN */}
        <div className="lg:col-span-8 flex justify-center bg-black/20 rounded-3xl p-6 border border-white/5 relative min-h-[600px] overflow-hidden">
          {/* Subtle grid mesh behind roadmap */}
          <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

          {/* SVG Connector container */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Background static circuit path */}
            <path
              d={generatePathString()}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="5"
            />
            {/* Foreground animated circuit path (strokey pulse simulator) */}
            <path
              d={generatePathString()}
              fill="none"
              stroke="rgba(6, 182, 212, 0.45)"
              strokeWidth="2.5"
              strokeDasharray="6"
              className="animate-[stroke_25s_linear_infinite]"
              style={{ strokeDashoffset: 120 }}
            />
          </svg>

          {/* Interactive Absolute Nodes */}
          <div className="absolute inset-0 w-full h-full z-10">
            {dynamicNodes.map((node, i) => {
              const pt = responsiveCoordinates[i] || { x: 100, y: 100 };
              const nodeStyle = getNodeColor(node.status);
              
              return (
                <div
                  key={node.id}
                  style={{ left: `${(pt.x / 520) * 85}%`, top: `${pt.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-12 h-12 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 relative ${nodeStyle}`}
                  >
                    {node.status === 'completed' && <Check className="w-5 h-5" />}
                    {node.status === 'in-progress' && <Play className="w-5 h-5 fill-current animate-pulse text-cyan-300" />}
                    {node.status === 'locked' && <Lock className="w-4 h-4.5" />}

                    {/* Ring hover pulse for progress nodes */}
                    {node.status === 'in-progress' && (
                      <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
                    )}

                    {/* Left/Right Text tooltip helper details */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-44 text-center">
                      <span className="block text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
                        {node.week}
                      </span>
                      <span className="block text-[10px] text-gray-300 truncate leading-snug font-semibold select-none font-display">
                        {node.title}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDE DRAWER COLUMN (Slides in when node selected or default selected node) */}
        <div className="lg:col-span-4 h-full relative">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35 }}
                className="w-full rounded-2xl p-6 bg-cyber-card border border-indigo-500/20 shadow-2xl relative"
              >
                {/* Header controls drawer */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-xs font-black text-indigo-300 uppercase">
                      {selectedNode.week}
                    </span>
                    <span className="text-[10px] text-gray-500 tracking-wide">DETAIL_RIG</span>
                  </div>

                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="p-1 rounded-md bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <h3 className="font-display font-extrabold text-white text-lg tracking-tight mb-2">
                  {selectedNode.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-5">
                  {selectedNode.description}
                </p>

                {/* Score bonus metadata */}
                <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex items-center justify-between text-xs mb-5 font-mono">
                  <span className="text-gray-400">Completion XP:</span>
                  <span className="text-amber-400 font-black flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> + {selectedNode.xpReward} XP
                  </span>
                </div>

                {/* Skills Acquire listed parameters */}
                <div className="space-y-4 mb-6 font-sans">
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Skills Acquired
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.skillsAcquired.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2.5 py-1 rounded bg-indigo-500/5 text-indigo-300 font-medium border border-indigo-500/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects modules included */}
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-400" /> Lab Showcase Project
                    </h4>
                    <div className="space-y-1.5">
                      {selectedNode.projects.map((proj) => (
                        <div key={proj} className="flex gap-2 text-xs text-gray-300 border border-white/5 bg-black/25 p-2 rounded-lg">
                          <span className="text-cyber-cyan font-bold leading-none">▸</span>
                          <span className="font-medium">{proj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security Sandbox Alert Indicator when guest is exploring tracker */}
                {!user && (
                  <div className="mb-4 p-2.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[10px] text-amber-350">
                    <ShieldEllipsis className="w-4 h-4 shrink-0 text-amber-450 animate-pulse" />
                    <span>Using local sandbox fallback. Auth to sync.</span>
                  </div>
                )}

                {/* Drawer bottom controls */}
                {selectedNode.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-xs text-cyber-green font-bold bg-cyber-green/5 border border-cyber-green/20 p-3 rounded-lg text-center justify-center font-sans">
                    <Check className="w-4 h-4 text-emerald-400" /> Complete & Verified
                  </div>
                ) : selectedNode.status === 'in-progress' ? (
                  <GlowButton
                    onClick={runTerminalSimulation}
                    variant="cyan"
                    className="w-full text-xs py-3 font-semibold uppercase tracking-wider font-mono h-11"
                  >
                    Launch Terminal Workspace &rarr;
                  </GlowButton>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/45 border border-white/5 p-3 rounded-lg text-center justify-center font-mono">
                    <Lock className="w-3.5 h-4" /> MODULE_CURRENTLY_LOCKED
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full h-full min-h-[300px] border border-dashed border-white/5 bg-cyber-card/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 select-none font-sans">
                <Layers className="w-8 h-8 text-gray-600 mb-2" />
                <h4 className="text-gray-300 text-sm font-semibold mb-1">Click a Map Node</h4>
                <p className="text-[11px] text-gray-500 max-w-xs leading-normal">
                  Select any week's node on the timeline path map layout to load detailed sub-module parameters, XP details, and simulation projects.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Futuristic Simulator Terminal Overlay Modal */}
      <AnimatePresence>
        {isSimulatingTerminal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.95 }}
              className="max-w-2xl w-full rounded-xl bg-black border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col h-[400px]"
            >
              {/* Terminal Window Header Bar */}
              <div className="bg-[#111] px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyber-cyan tracking-wider ml-2 flex items-center gap-1.5">
                    <TermIcon className="w-3.5 h-3.5 text-cyan-400" /> {selectedNode?.projects[0] || "WORKSPACE_DEBUGGER"} - TARGET::SIM_RUN
                  </span>
                </div>
                <div className="text-[9px] font-mono text-gray-500 font-bold uppercase">SANDBOX_VM::ONLINE</div>
              </div>

              {/* Terminal Screen Body */}
              <div className="p-5 flex-1 overflow-y-auto font-mono text-xs text-cyan-400/90 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                {terminalLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.includes('[SUCCESS]')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('[WARNING]')
                        ? 'text-amber-400'
                        : 'text-gray-300'
                    }
                  >
                    {log}
                  </motion.div>
                ))}

                {/* Animated typing trailing block */}
                {!simSuccess && (
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2.5 h-4 bg-cyan-400"
                  />
                )}
              </div>

              {/* Terminal Footer Panel */}
              <div className="bg-[#111] border-t border-cyan-500/20 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-[10px] text-gray-500 font-mono">
                  Press acknowledge to close simulated telemetry session.
                </div>
                {simSuccess ? (
                  <GlowButton
                    onClick={() => {
                      setIsSimulatingTerminal(false);
                      setSelectedNodeId(null);
                    }}
                    variant="cyan"
                    className="text-xs py-2 px-8 font-black uppercase font-mono tracking-wider"
                  >
                    Acknowledge telemetry
                  </GlowButton>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-widest animate-pulse">
                    <ShieldEllipsis className="w-4 h-4 text-cyan-400" /> Computing telemetry coefficients...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
