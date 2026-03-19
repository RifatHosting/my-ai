import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface OrbitRingProps {
  size?: number;
  className?: string;
}

export function OrbitRing({ size = 400, className = '' }: OrbitRingProps) {
  const ringRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ringRef.current || !dotRef.current) return;

    // Continuous rotation animation
    gsap.to(ringRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
    });

    // Pulsing dot animation
    gsap.to(dotRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      gsap.killTweensOf(ringRef.current);
      gsap.killTweensOf(dotRef.current);
    };
  }, []);

  const radius = size / 2 - 10;
  const center = size / 2;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        ref={ringRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ transformOrigin: 'center' }}
      >
        {/* Main ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        
        {/* Inner glow ring */}
        <circle
          cx={center}
          cy={center}
          r={radius - 8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
        
        {/* Outer glow ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
      </svg>
      
      {/* Orbiting dot */}
      <div
        ref={dotRef}
        className="absolute w-4 h-4 bg-white rounded-full shadow-glow"
        style={{
          top: center - radius - 8,
          left: center - 8,
          transformOrigin: `${center}px ${center + radius + 8}px`,
        }}
      />
      
      {/* Center content placeholder */}
      <div 
        className="absolute rounded-full overflow-hidden border border-white/10"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          top: size * 0.2,
          left: size * 0.2,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <span className="text-4xl font-display font-bold text-white/80">N</span>
        </div>
      </div>
    </div>
  );
}
