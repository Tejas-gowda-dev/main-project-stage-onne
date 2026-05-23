import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Trophy, Terminal, ChevronDown } from 'lucide-react';
import GlowButton from './GlowButton';
import AnimatedCounter from './AnimatedCounter';

interface HeroSectionProps {
  onApplyClick: () => void;
  onExploreClick: () => void;
}

export default function HeroSection({ onApplyClick, onExploreClick }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const headlineText = "Engineer Your Future. Start With Us.";

  useEffect(() => {
    // GSAP Timeline to coordinate cinematic entrance
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Stagger letters upwards
      tl.fromTo(
        lettersRef.current,
        { y: 80, opacity: 0, filter: 'blur(5px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.02, delay: 0.2 }
      );

      // 2. Fade in subtitle from blur
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        '-=0.4'
      );

      // 3. Slide in floating badge
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 },
        '-=0.6'
      );

      // 4. Spring Scale CTA Buttons
      tl.fromTo(
        btnsRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
        '-=0.5'
      );

      // 5. Turn on stats panel
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 overflow-hidden select-none"
    >
      {/* Dynamic drifting background particles */}
      <span className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[130px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
      <span className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[130px] animate-pulse-glow" style={{ animationDuration: '6s' }} />

      {/* Main Grid Banner */}
      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        
        {/* Floating badge */}
        <div ref={badgeRef} className="mb-6 opacity-0">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-200 uppercase">
              ★ 50+ Engineering Domains Configured
            </span>
          </motion.div>
        </div>

        {/* Dynamic Character Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
          {headlineText.split("").map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) lettersRef.current[index] = el;
              }}
              className="inline-block whitespace-pre opacity-0"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Cinematic Subtitle */}
        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed mb-10 opacity-0 font-sans"
        >
          India’s most{' '}
          <span className="text-white font-medium border-b border-cyber-cyan/30">immersive internship experience</span>{' '}
          for engineering students — powered by real projects, expert mentors, and cutting-edge laboratory simulations.
        </p>

        {/* Action Button cluster */}
        <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 items-center justify-center opacity-0 w-full sm:w-auto mb-20">
          <GlowButton variant="gradient" onClick={onApplyClick} className="w-full sm:w-56 h-13 text-sm">
            Apply Now
            <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </GlowButton>
          <GlowButton variant="outline" onClick={onExploreClick} className="w-full sm:w-56 h-13 text-sm">
            Explore Programs
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
          </GlowButton>
        </div>

        {/* Interactive Math counters */}
        <div
          ref={statsRef}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6 md:px-12 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md relative opacity-0 max-w-4xl"
        >
          {/* Subtle code visual mark */}
          <div className="absolute top-2 right-4 font-mono text-[9px] text-gray-500">
            METRICS_SYS_V2.5
          </div>

          <div className="text-center flex flex-col justify-center items-center">
            <span className="text-3xl sm:text-4xl text-gradient block mb-1">
              <AnimatedCounter value={12000} suffix="+" />
            </span>
            <span className="text-xs text-gray-400 tracking-wider font-display uppercase font-medium">Students Trained</span>
          </div>

          <div className="text-center flex flex-col justify-center items-center border-l border-white/5">
            <span className="text-3xl sm:text-4xl text-gradient text-cyan-400 block mb-1">
              <AnimatedCounter value={95} suffix="%" />
            </span>
            <span className="text-xs text-gray-400 tracking-wider font-display uppercase font-medium">Placement Ratio</span>
          </div>

          <div className="text-center flex flex-col justify-center items-center border-l border-white/5">
            <span className="text-3xl sm:text-4xl text-gradient block mb-1">
              <AnimatedCounter value={200} suffix="+" />
            </span>
            <span className="text-xs text-gray-400 tracking-wider font-display uppercase font-medium">Industry Mentors</span>
          </div>

          <div className="text-center flex flex-col justify-center items-center border-l border-white/5">
            <span className="text-3xl sm:text-4xl text-gradient text-purple-400 block mb-1">
              <AnimatedCounter value={50} suffix="+" />
            </span>
            <span className="text-xs text-gray-400 tracking-wider font-display uppercase font-medium">Domains Open</span>
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator Chevron */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        onClick={onExploreClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold text-center">
          scroll index
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-md">
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </div>
      </motion.div>
    </div>
  );
}
