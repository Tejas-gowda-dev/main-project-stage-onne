import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TESTIMONIALS } from '../data';
import { Star } from 'lucide-react';

export default function TestimonialSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    // We animate standard translation xPercent: -50 to make it loop seamlessly.
    // Ensure we have perfect linear easing over a longer duration for calm ticker movement.
    const tickerWidth = marqueeRef.current.clientWidth;
    
    const tween = gsap.to(marqueeRef.current, {
      x: `-${tickerWidth / 2}px`,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });

    tweenRef.current = tween;

    // cleanup on unmount
    return () => {
      tween.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      // Pause ticker smoothly
      gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5, overwrite: 'auto' });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      // Resume ticker smoothly
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5, overwrite: 'auto' });
    }
  };

  // Duplicate the array of testimonials to ensure infinite seamless scrolling
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div 
      className="relative w-full h-auto py-12 overflow-hidden bg-gradient-to-b from-transparent via-cyber-card/25 to-transparent border-y border-white/5 whitespace-nowrap select-none"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual fade overlays on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-cyber-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-cyber-bg to-transparent z-10 pointer-events-none" />

      {/* Marquee Tray containing cards */}
      <div 
        ref={marqueeRef}
        className="inline-flex gap-6 px-4"
        style={{ width: 'max-content' }}
      >
        {duplicatedTestimonials.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex flex-col justify-between w-80 md:w-96 rounded-xl border border-white/5 bg-cyber-card/65 p-6 backdrop-blur-md select-none pointer-events-auto transition-colors duration-300 hover:border-indigo-500/30 hover:bg-cyber-card-bright/80 whitespace-normal"
          >
            <div>
              {/* Star indicators */}
              <div className="flex gap-1 mb-4 text-cyber-cyan">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-cyan-400" />
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-300 italic line-clamp-3 leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
              <img
                src={item.avatar}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              />
              <div className="min-w-0">
                <h4 className="font-display font-medium text-sm text-gray-100 truncate">{item.name}</h4>
                <p className="text-xs text-cyber-cyan truncate">{item.college} • {item.domain}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
