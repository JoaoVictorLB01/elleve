import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Flame, Crown } from "lucide-react";

interface LevelBadgeProps {
  xp: number;
  delay?: number;
}

const levels = [
  { name: "Despertar", icon: Sparkles, color: "text-blue-400", bgGlow: "shadow-blue-500/20", minXp: 0, maxXp: 50 },
  { name: "Em evolução", icon: Flame, color: "text-primary", bgGlow: "shadow-primary/20", minXp: 50, maxXp: 150 },
  { name: "Iluminado", icon: Crown, color: "text-accent", bgGlow: "shadow-accent/20", minXp: 150, maxXp: 300 },
];

const LevelBadge = ({ xp, delay = 0 }: LevelBadgeProps) => {
  const currentLevel = levels.reduce((acc, lvl, i) => (xp >= lvl.minXp ? i : acc), 0);
  const level = levels[currentLevel];
  const LevelIcon = level.icon;
  const progress = Math.min(((xp - level.minXp) / (level.maxXp - level.minXp)) * 100, 100);
  const xpToNext = level.maxXp - xp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`border border-border rounded-2xl bg-card p-5 shadow-lg ${level.bgGlow}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className={`p-2.5 rounded-xl bg-muted ${level.color}`}
        >
          <LevelIcon className="h-5 w-5" />
        </motion.div>
        <div>
          <div className="text-sm font-semibold text-foreground">
            Nível {currentLevel + 1} — {level.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {xpToNext > 0 ? `${xpToNext} XP para o próximo nível` : "Nível máximo alcançado ✨"}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{xp} XP</span>
          <span>{level.maxXp} XP</span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(265, 55%, 52%), hsl(280, 60%, 68%), hsl(40, 80%, 58%))",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LevelBadge;
