import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counterObj = { count: 0 };
    
    // Smooth scroll trigger animation mimicking counter rise
    const anim = gsap.to(counterObj, {
      count: value,
      duration: duration,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayValue(Math.floor(counterObj.count));
      },
    });

    return () => {
      anim.kill();
    };
  }, [value, duration]);

  // format nice thousands if applicable
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 1000).toFixed(0) + ',000';
    }
    if (num >= 1000) {
      // return with commas e.g. 1,200
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toString();
  };

  return (
    <span ref={elementRef} className="font-display font-bold tabular-nums">
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}
