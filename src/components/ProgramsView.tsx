import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Box, GraduationCap, Flame, Bot, Lock, QrCode, CreditCard, Building2, RefreshCw, Check, X } from 'lucide-react';
import { PROGRAMS, DOMAINS } from '../data';
import { Program, UserSession } from '../types';
import ProgramCard from './ProgramCard';
import GlowButton from './GlowButton';

interface ProgramsViewProps {
  user: UserSession | null;
  onProgressUpdate: (updatedUser: UserSession) => void;
  onLoginClick: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ProgramsView({ user, onProgressUpdate, onLoginClick, onNavigateToTab }: ProgramsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'CSE' | 'ECE' | 'Mechanical' | 'Civil' | 'AI & ML' | 'Embedded' | 'IoT' | 'Robotics'>('All');
  const miniThreeRef = useRef<HTMLDivElement>(null);

  // checkout modal state machine
  const [selectedPurchaseProgram, setSelectedPurchaseProgram] = useState<Program | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbank'>('upi');
  const [paymentStep, setPaymentStep] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');
  const [transactionLog, setTransactionLog] = useState<string>('');

  // mock card variables
  const [cardNum, setCardNum] = useState('4532 9912 8847 2109');
  const [cardExpiry, setCardExpiry] = useState('11 / 29');
  const [cardCVV, setCardCVV] = useState('191');
  const [cardName, setCardName] = useState(() => user?.name?.toUpperCase() || 'ARJUN SINGH');

  // Filter program list
  const filteredPrograms = activeFilter === 'All'
    ? PROGRAMS
    : PROGRAMS.filter((p) => p.domain === activeFilter);

  // Mini 3D rotating crystalline robot Joint scene
  useEffect(() => {
    if (!miniThreeRef.current) return;
    const container = miniThreeRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic metallic lighting
    const light = new THREE.DirectionalLight(0x06B6D4, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    // Crystalline joint: double sphere with orbital circuit lines
    const coreGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ringMesh01 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh01.rotation.x = Math.PI / 4;
    scene.add(ringMesh01);

    const ringMesh02 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh02.rotation.y = Math.PI / 3;
    scene.add(ringMesh02);

    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      // Rotate geometric indices
      coreMesh.rotation.y = time * 0.35;
      coreMesh.rotation.x = time * 0.15;

      ringMesh01.rotation.z = -time * 0.4;
      ringMesh02.rotation.z = time * 0.25;

      // Pulse core scale
      const scale = 1 + Math.sin(time * 3) * 0.08;
      coreMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    render();

    // Resize tracking
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleFeaturedAction = () => {
    if (!user) {
      onLoginClick();
      return;
    }
    const featuredProg = PROGRAMS[0];
    if (user.purchasedPrograms?.includes(featuredProg.id)) {
      onNavigateToTab('track');
    } else {
      setSelectedPurchaseProgram(featuredProg);
      setPaymentStep('initial');
      setIsCheckingOut(true);
    }
  };

  const handleProcessPayment = async () => {
    if (!user || !selectedPurchaseProgram) return;

    setPaymentStep('processing');
    setTransactionLog('Connecting to secure Interbank Gateway...');

    try {
      // Simulate transaction steps
      await new Promise(r => setTimeout(r, 600));
      setTransactionLog('Decrypting transaction payload & tokenizing keys...');

      await new Promise(r => setTimeout(r, 600));
      setTransactionLog('Confirming ledger verification with NPCI APIs...');

      await new Promise(r => setTimeout(r, 650));
      
      const response = await fetch('/api/programs/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          programId: selectedPurchaseProgram.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected transaction.');
      }

      const data = await response.json();
      setPaymentStep('success');
      
      if (data.user) {
        onProgressUpdate(data.user);
      }
    } catch (err: any) {
      console.error(err);
      setTransactionLog(`TRANSACTION_FAILED: ${err.message || "Endpoint error"}`);
      setPaymentStep('error');
    }
  };

  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none">
      
      {/* Title block */}
      <div className="text-center md:text-left mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <GraduationCap className="w-4 h-4 text-cyber-cyan" />
          <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-300 tracking-widest uppercase">
            Curriculum Catalog
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
          Specialization Tracks
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-sans">
          Rigorous 8 to 12-week industrial simulations configured for engineering cohorts. Every track completes with a verified system deployment case study.
        </p>
      </div>

      {/* Featured Immersive Banner */}
      <div className="w-full relative rounded-3xl overflow-hidden glass-card border-indigo-500/20 mb-16 shadow-2xl group grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <span className="absolute top-2 right-4 font-mono text-[9px] text-gray-600">FEATURED_FLAG::HOT_COHORT</span>

        {/* Info Grid Text Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center items-start z-10 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider font-display mb-4 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            High Demand Track
          </div>
          
          <h3 className="text-2xl sm:text-3.5xl font-display font-bold text-white tracking-tight leading-tight mb-3 group-hover:text-cyan-300 transition-colors duration-300">
            AI & Autonomous Robotics Master Class
          </h3>
          
          <p className="text-sm text-gray-400 mb-6 max-w-lg font-sans leading-relaxed">
            Configure matrix rotational joint splines, map laser distance boundaries with Cartographer SLAM, and package neural inference engines over low-latency ROS 2 channels. Includes simulated warehouse rover capstones.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-display text-gray-300 mb-8 border-l-2 border-cyan-400/50 pl-4 font-medium">
            <div>Duration: <span className="text-white font-semibold">12 Weeks</span></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full my-auto" />
            <div>Level: <span className="text-white font-semibold">Advanced</span></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full my-auto" />
            <div>Credits: <span className="text-white font-semibold">4.9 System Rigs</span></div>
          </div>

          {user?.purchasedPrograms?.includes(PROGRAMS[0].id) ? (
            <GlowButton
              variant="cyan"
              onClick={() => onNavigateToTab('track')}
              className="text-xs h-12 w-full sm:w-auto"
            >
              <Bot className="w-4 h-4 text-white hover:animate-spin" />
              Track Learning Roadmap (Owned)
            </GlowButton>
          ) : (
            <GlowButton
              variant="cyan"
              onClick={handleFeaturedAction}
              className="text-xs h-12 w-full sm:w-auto font-mono"
            >
              <Bot className="w-4 h-4 text-white animate-pulse" />
              Unlock Autonomous Robotics • ₹5,000
            </GlowButton>
          )}
        </div>

        {/* 3D Canvas Column */}
        <div className="md:col-span-5 h-[280px] md:h-auto min-h-[250px] relative w-full overflow-hidden flex items-center justify-center bg-black/25">
          <div ref={miniThreeRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent md:bg-gradient-to-r md:from-cyber-bg md:to-transparent pointer-events-none" />
          
          {/* Orbital wireframe statistics coordinate background element */}
          <div className="absolute right-4 bottom-4 font-mono text-[9px] text-gray-500 text-right">
            <span>R_JOINT_V_X: 1.05e-3</span>
            <br />
            <span>RAD_SEC_CLOCK::OK</span>
          </div>
        </div>
      </div>

      {/* Pill Filters Bar */}
      <div className="w-full mb-10 overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-2 min-w-max px-1">
          {DOMAINS.map((domain) => {
            const active = activeFilter === domain;
            return (
              <button
                key={domain}
                onClick={() => setActiveFilter(domain)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider font-display rounded-xl transition-all duration-300 cursor-pointer select-none border ${
                  active
                    ? 'text-white bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                    : 'text-gray-400 bg-white/5 border-white/5 hover:text-gray-100 hover:bg-white/10'
                }`}
              >
                <span>{domain}</span>
                {active && (
                  <motion.span
                    layoutId="pillUnderline"
                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Programs Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredPrograms.map((prog) => (
            <motion.div
              layout
              key={prog.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
            >
              <ProgramCard 
                program={prog} 
                onEnrollClick={(p) => onNavigateToTab('track')} 
                user={user}
                onPurchaseClick={(p) => {
                  if (!user) {
                    onLoginClick();
                  } else {
                    setSelectedPurchaseProgram(p);
                    setPaymentStep('initial');
                    setIsCheckingOut(true);
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty visual alert if filters return none */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md max-w-lg mx-auto w-full mt-8 flex flex-col items-center">
          <Compass className="w-12 h-12 text-gray-500 mb-3 animate-spin" style={{ animationDuration: '10s' }} />
          <h4 className="text-gray-300 font-display font-semibold mb-1">No Specializations Configured</h4>
          <p className="text-xs text-gray-500 max-w-sm">No courses currently matching this domain criteria are active for registration.</p>
        </div>
      )}

      {/* IMMERSIVE COHORT SECURE PAYMENT TRANSACTION GATEWAY DRAWER */}
      <AnimatePresence>
        {isCheckingOut && selectedPurchaseProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#0D0B14] border-2 border-indigo-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.25)] select-none text-left"
            >
              {/* Close Button unless we are actively locking ledger processing */}
              {paymentStep !== 'processing' && (
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Padlock Secure Banner Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-6 w-fit">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold text-indigo-300 tracking-widest uppercase">
                  Secure Bank Terminal
                </span>
              </div>

              {/* PAYMENT STEPS */}
              {paymentStep === 'initial' && (
                <div>
                  <h3 className="text-xl font-display font-extrabold text-white mb-2">Configure Transaction</h3>
                  <p className="text-xs text-gray-400 font-sans mb-4">
                    Confirm your chosen professional specialization track and coordinate credit/ledger credentials.
                  </p>

                  {/* Summary card */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">Selected Specialization</span>
                      <strong className="block text-[13px] text-indigo-200 mt-0.5">{selectedPurchaseProgram.title}</strong>
                      <span className="block text-[10px] text-gray-400 mt-0.5">{selectedPurchaseProgram.duration} • {selectedPurchaseProgram.mentorName}</span>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">Core Price</span>
                      <strong className="block text-xl text-cyan-400 font-display font-black mt-0.5">
                        ₹{selectedPurchaseProgram.price?.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-6 font-sans">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 rounded-lg text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'upi' ? 'bg-indigo-500/20 text-white border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      UPI QR Code
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 rounded-lg text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'bg-indigo-500/20 text-white border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Credit/Debit
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbank')}
                      className={`py-2 rounded-lg text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === 'netbank' ? 'bg-indigo-500/20 text-white border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Netbanking
                    </button>
                  </div>

                  {/* Tab specific inputs */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 mb-6 text-center">
                      <div className="p-3 bg-white inline-block rounded-xl border-4 border-double border-indigo-500/30 shadow-lg">
                        {/* Interactive Simulated Vector QR pattern */}
                        <div className="w-36 h-36 border-4 border-black flex flex-col items-center justify-center p-1 bg-white relative">
                          <div className="absolute inset-1.5 border border-black/10 flex flex-wrap gap-1 p-1 overflow-hidden pointer-events-none opacity-90 select-none">
                            {Array.from({ length: 42 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-sm ${
                                  (i * 13) % 4 === 0 || (i % 7 === 0) || (i < 9 && i !== 2) ? 'bg-black' : 'bg-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-cyan-500 z-10 flex items-center justify-center text-white text-[9px] font-black tracking-tighter">IF</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans tracking-wide col-span-3">
                        Scan the unified QR coordinate using BHIM, GPay, Paytm, or PhonePe or enter custom identifier.
                      </p>
                      <input
                        type="text"
                        readOnly
                        value={`${user?.email?.split('@')[0]}@ybl`}
                        className="px-4 py-2 border border-white/5 rounded-lg bg-black/40 text-center font-mono text-xs text-indigo-300 w-full select-all focus:outline-none focus:border-indigo-500/30"
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNum}
                          onChange={(e) => setCardNum(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Expiration</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Card Verification (CVV)</label>
                          <input
                            type="text"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            maxLength={3}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-gray-200 font-sans tracking-wide"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbank' && (
                    <div className="mb-6 space-y-3">
                      <label className="block text-[10px] text-gray-500 uppercase tracking-widest">Select Interbank Gateway</label>
                      <div className="grid grid-cols-2 gap-3.5">
                        {['State Bank of India', 'HDFC Bank C_L', 'ICICI Net Link', 'Axis Bank Retail', 'BITS Pilani Edu Credit', 'Canara Bank India'].map((bk) => (
                          <button
                            key={bk}
                            type="button"
                            onClick={() => setTransactionLog(`Selected bank gateway: ${bk}`)}
                            className="p-3 text-left rounded-xl bg-black/45 hover:bg-white/[0.03] border border-white/5 text-xs text-gray-300 hover:text-white transition-all font-sans font-medium flex items-center gap-2"
                          >
                            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{bk}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <GlowButton
                    variant="gradient"
                    onClick={handleProcessPayment}
                    className="w-full h-12 text-xs font-mono uppercase tracking-widest"
                  >
                    Authorize Payment (₹{selectedPurchaseProgram.price?.toLocaleString()}) &rarr;
                  </GlowButton>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center font-mono space-y-6">
                  <div className="relative">
                    <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
                    <Lock className="w-4 h-4 text-white absolute inset-0 m-auto" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold uppercase text-gray-200 tracking-wider">Processing Transaction Record</h4>
                    <p className="text-xs text-gray-400 animate-pulse">{transactionLog}</p>
                  </div>
                  
                  <div className="p-3 w-full bg-black/45 border border-white/5 rounded-xl text-left font-mono text-[10px] text-gray-600 line-clamp-2 select-all">
                    <span>TXN_SIG::SHA-512::{(Math.random() * 100000000).toString(16)}...</span>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-bounce">
                    <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
                  </div>

                  <div className="space-y-2 select-none">
                    <h3 className="text-2xl font-display font-black text-white">Payment Confirmed!</h3>
                    <p className="text-xs text-gray-400 font-sans max-w-sm">
                      Specialization track <strong>"{selectedPurchaseProgram.title}"</strong> has been successfully registered on your student profile records.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full text-left font-sans text-xs bg-black/45 p-4 rounded-xl border border-white/5 select-text mb-4">
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">Debited Sum</span>
                      <strong className="text-emerald-400 font-bold text-sm">₹{selectedPurchaseProgram.price?.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">Tax Category</span>
                      <strong className="text-gray-300 font-semibold text-sm">0% GST Labs discount</strong>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5">
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">License Authorization Code</span>
                      <span className="text-[10.5px] font-mono text-indigo-300">IF-CRED-{selectedPurchaseProgram.id.substring(5).toUpperCase()}-{Math.floor(1000 + Math.random()*9000)}</span>
                    </div>
                  </div>

                  <GlowButton
                    variant="cyan"
                    onClick={() => {
                      setIsCheckingOut(false);
                      onNavigateToTab('track');
                    }}
                    className="w-full h-12 text-xs font-semibold"
                  >
                    Get Started with Track Roadmap! &rarr;
                  </GlowButton>
                </div>
              )}

              {paymentStep === 'error' && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                    <X className="w-8 h-8 text-red-500 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-black text-white">Transaction Rejected</h3>
                    <p className="text-xs text-red-400 font-mono mt-1">{transactionLog}</p>
                    <p className="text-xs text-gray-400 font-sans max-w-xs mt-2 mx-auto">
                      Could not authorize the balance transfer. Please verify bank codes and try again.
                    </p>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      type="button"
                      onClick={() => setPaymentStep('initial')}
                      className="flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Retry Block
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition-all cursor-pointer"
                    >
                      Abort Checkout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
