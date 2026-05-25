import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Sparkles, Cpu, GraduationCap, Terminal, HelpCircle, ArrowRight 
} from 'lucide-react';

import { UserSession } from '../types';
import HeroSection from './HeroSection';
import TestimonialSlider from './TestimonialSlider';
import GlowButton from './GlowButton';

interface HomeViewProps {
  user: UserSession | null;
  onApplyClick: () => void;
  onExploreClick: () => void;
  onLoginClick: () => void;
}

export default function HomeView({ 
  user, 
  onApplyClick, 
  onExploreClick, 
  onLoginClick 
}: HomeViewProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'track' | 'certificate'>('dashboard');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How does the hands-on hardware & compiler simulation work?",
      answer: "We run actual low-level emulator environments inside a high-speed sandboxed container. You write standard hardware routines, load complex matrix variables, and run compiler sequences (e.g. ROS 2 joint configs, preemptive FreeRTOS scheduling models) entirely on-screen, without needing pricey physical hardware boards."
    },
    {
      id: 2,
      question: "Are the graduation certificates verified offline?",
      answer: "Yes. Every completion certificate has an associated cryptographic authorization ID linked with a real database record. Anyone, including college administrators and hiring managers, can verify completion markers offline or via LinkedIn custom-printable vector PDF credentials."
    },
    {
      id: 3,
      question: "Do I need prior experience with embedded systems or AI before joining?",
      answer: "No. Each specialized engineering track starts with fundamental sandbox simulations, expanding incrementally from basic variable declarations to full-fledged firmware kernels. We provide contextual tooltips, video instructions, and calendar synchronizations to keep you on track."
    },
    {
      id: 4,
      question: "When are the live sessions or mentor office hours scheduled?",
      answer: "Office hours and interactive design loops are highly flexible. Enrolled students use our integrated calendar orchestration features to lock in direct 1-on-1 loops with professional hardware mentors, ensuring continuous reviews and resume audits."
    },
    {
      id: 5,
      question: "What is the fee structure and is there a refund policy?",
      answer: "Each specialized internship program lists transparent micro-fees directly in the Programs view. If you decide the simulation sandbox doesn't align with your academic engineering path, you can coordinate quick support reversals with our secure National Gateway ledgers."
    }
  ];

  return (
    <div className="w-full">
      {/* LANDING / HERO PAGE */}
      <HeroSection onApplyClick={onApplyClick} onExploreClick={onExploreClick} />

      {/* Bento Grid Engineering Showcase section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
            <Cpu className="w-4 h-4 text-cyber-cyan" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-300 tracking-widest uppercase">LAB_SIMULATION_RIGS</span>
          </div>
          <h3 className="text-2xl sm:text-4.5xl font-display font-extrabold text-white tracking-tight leading-none mb-4 animate-[pulse_3s_ease-in-out_infinite]">
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
                  onClick={onLoginClick}
                  className="text-[9px] font-mono text-white bg-amber-500 hover:bg-amber-400 px-2.5 py-1 rounded font-bold uppercase transition-all cursor-pointer shadow-md"
                >
                  Sign In To Activate Real Access &arr;
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
                <GraduationCap className="w-5 h-5 animate-bounce" style={{ animationDuration: '4s' }} />
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
              // READY TO JOIN 12,000+ COHORT CADETS IN DEPLOYMENT?
            </p>
            <GlowButton onClick={onLoginClick} variant="gradient" className="w-full sm:w-72 h-12 text-xs">
              Provision Engineering Profile Now &arr;
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

      {/* Interactive & Search Optimized FAQ Accordion Section */}
      <section id="faq-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto select-none border-t border-white/5 mt-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-300 tracking-widest uppercase">FAQ_DIRECTORY</span>
          </div>
          <h3 className="font-display font-extrabold text-2.5xl sm:text-4xl text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-gray-450 mt-2 font-sans max-w-sm mx-auto">
            Quickly master the core mechanics of our immersive training pipelines and certification credentials.
          </p>
        </div>

        <div className="space-y-3.5 text-left font-sans">
          {faqs.map((faq) => {
            const isOpen = expandedFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-indigo-950/15 border-indigo-500/35 shadow-[0_0_20px_rgba(99,102,241,0.08)]' 
                    : 'bg-black/30 border-white/5 hover:border-white/10 hover:bg-black/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none cursor-pointer group"
                >
                  <span className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                    isOpen ? 'text-cyan-300' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-all duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-[11.5px] sm:text-xs text-gray-400 leading-relaxed font-sans border-t border-white/[0.03]">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
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
        <GlowButton variant="gradient" onClick={onApplyClick} className="h-13 w-full sm:w-56 text-sm">
          Apply Today
        </GlowButton>
      </section>
    </div>
  );
}
