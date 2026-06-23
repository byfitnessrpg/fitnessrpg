import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  tx: number;
  ty: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#7c3aed', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6', '#ec4899', '#a78bfa'];
    const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 150;
      return {
        id: i,
        x: 40 + Math.random() * 20, // percentage x
        y: 30 + Math.random() * 20, // percentage y
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 10,
        delay: Math.random() * 0.3,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `translate(${p.tx}px, ${p.ty}px)`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
