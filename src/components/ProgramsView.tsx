import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Box, GraduationCap, Flame, Bot } from 'lucide-react';
import { PROGRAMS, DOMAINS } from '../data';
import { Program } from '../types';
import ProgramCard from './ProgramCard';
import GlowButton from './GlowButton';

interface ProgramsViewProps {
  onEnrollClick: (program: Program) => void;
}

export default function ProgramsView({ onEnrollClick }: ProgramsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'CSE' | 'ECE' | 'Mechanical' | 'Civil' | 'AI & ML' | 'Embedded' | 'IoT' | 'Robotics'>('All');
  const miniThreeRef = useRef<HTMLDivElement>(null);

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

          <GlowButton
            variant="cyan"
            onClick={() => onEnrollClick(PROGRAMS[0])}
            className="text-xs h-12 w-full sm:w-auto"
          >
            <Bot className="w-4 h-4 text-white hover:animate-spin" />
            Enroll Robotic Track (ROS 2)
          </GlowButton>
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
              <ProgramCard program={prog} onEnrollClick={onEnrollClick} />
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
    </div>
  );
}
