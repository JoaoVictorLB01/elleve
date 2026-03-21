import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RadialProgressProps {
  value: number;
  max: number;
  label: string;
  icon: ReactNode;
  suffix?: string;
  size?: number;
  delay?: number;
}

const RadialProgress = ({ value, max, label, icon, suffix = "", size = 80, delay = 0 }: RadialProgressProps) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const gradientId = `progressGradient-${label.replace(/\s/g, '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * percentage) / 100 }}
            transition={{ delay: delay + 0.3, duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(265, 55%, 52%)" />
              <stop offset="100%" stopColor="hsl(280, 60%, 68%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-primary mb-0.5">{icon}</div>
          <motion.span
            className="text-lg font-bold text-foreground leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }}
          >
            {value}{suffix}
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center leading-tight max-w-[80px]">{label}</span>
    </motion.div>
  );
};

export default RadialProgress;
