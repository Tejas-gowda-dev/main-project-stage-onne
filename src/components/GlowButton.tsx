import React from 'react';
import { motion } from 'motion/react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'gradient' | 'outline' | 'cyan' | 'purple';
  type?: 'button' | 'submit';
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function GlowButton({
  children,
  onClick,
  variant = 'gradient',
  type = 'button',
  className = '',
  id,
  disabled = false,
}: GlowButtonProps) {
  let styleClasses = '';

  if (variant === 'gradient') {
    styleClasses = 'accent-gradient text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] border border-indigo-400/20';
  } else if (variant === 'outline') {
    styleClasses = 'bg-white/5 hover:bg-white/10 text-white font-medium border border-white/20 hover:border-white/40 shadow-sm';
  } else if (variant === 'cyan') {
    styleClasses = 'cyan-gradient text-white font-medium shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] border border-cyan-400/20';
  } else if (variant === 'purple') {
    styleClasses = 'bg-cyber-purple text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] border border-purple-400/20';
  }

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.025, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-sm group select-none active:scale-95 ${
        disabled ? 'opacity-55 cursor-not-allowed pointer-events-none' : ''
      } ${styleClasses} ${className}`}
    >
      {/* Dynamic hover sparkle shimmer overlay */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" 
            style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', backgroundSize: '200% 100%' }} />
      
      {/* Glow dot in background */}
      <span className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyan-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="relative z-10 flex items-center gap-2 font-display">
        {children}
      </span>
    </motion.button>
  );
}
