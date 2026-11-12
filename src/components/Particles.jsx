import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Particles({ count = 30 }) {
  // Reduce particles heavily on smaller screens to prevent lag
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const actualCount = isMobile ? Math.min(count, 8) : count;

  // Generate random particles once
  const particles = useMemo(() => {
    return Array.from({ length: actualCount }).map((_, i) => {
      const size = Math.random() * 4 + 1; // 1px to 5px
      const xStart = Math.random() * 100; // 0 to 100%
      const yStart = Math.random() * 100; // 0 to 100%
      const duration = Math.random() * 20 + 10; // 10s to 30s
      const delay = Math.random() * 10; // 0s to 10s
      const opacity = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
      
      return { id: i, size, xStart, yStart, duration, delay, opacity };
    });
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.xStart}vw`,
            y: `${p.yStart}vh`,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [`${p.yStart}vh`, `${p.yStart - 20}vh`],
            opacity: [0, p.opacity, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'var(--rg-gold)',
              boxShadow: '0 0 4px var(--rg-gold)',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
        />
      ))}
    </div>
  );
}
