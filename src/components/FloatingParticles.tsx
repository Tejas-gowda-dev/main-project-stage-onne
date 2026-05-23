import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
}

export default function FloatingParticles({ count = 40, color = 'rgba(6, 182, 212, 0.15)', speed = 0.5 }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 1 + Math.random() * 3;
        this.speedY = -(0.1 + Math.random() * speed);
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5;
        this.fadeSpeed = 0.002 + Math.random() * 0.005;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // fade loop
        this.opacity -= this.fadeSpeed;
        if (this.y < 0 || this.opacity <= 0) {
          // Recycle
          this.x = Math.random() * width;
          this.y = height + 10;
          this.size = 1 + Math.random() * 3;
          this.speedY = -(0.1 + Math.random() * speed);
          this.speedX = (Math.random() - 0.5) * 0.15;
          this.opacity = 0.4 + Math.random() * 0.6;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = color.replace('0.15', this.opacity.toFixed(2));
        context.shadowColor = color;
        context.shadowBlur = 4;
        context.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const matchFrame = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animId = requestAnimationFrame(matchFrame);
    };

    matchFrame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70 z-0"
    />
  );
}
