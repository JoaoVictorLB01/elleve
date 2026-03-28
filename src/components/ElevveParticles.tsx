import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Lightweight spiritual symbols floating in the background.
 * Uses CSS + framer-motion (no Three.js) to keep it performant.
 */

const SYMBOLS = ["✦", "✧", "◇", "⟡", "☽", "✺", "⊹"];

interface Particle {
  id: number;
  symbol: string;
  x: number; // % from left
  y: number; // % from top (start)
  size: number; // rem
  duration: number; // seconds
  delay: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "hsl(265 55% 55%)",
  "hsl(265 50% 72%)",
  "hsl(40 82% 62%)",
  "hsl(280 50% 60%)",
  "hsl(320 60% 55%)",
];

const ElevveParticles = ({ count = 18 }: { count?: number }) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      y: 20 + Math.random() * 70,
      size: 0.45 + Math.random() * 0.55,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      opacity: 0.06 + Math.random() * 0.1,
      color: COLORS[i % COLORS.length],
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            color: p.color,
            opacity: 0,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, p.opacity, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default ElevveParticles;
