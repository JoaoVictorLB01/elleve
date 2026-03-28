import { motion } from "framer-motion";
import { Heart, Users, Sparkles, Wallet, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const topics = [
  {
    id: "familia",
    icon: Users,
    title: "Elevve sua família",
    description: "Fortaleça os laços familiares com consciência e amor.",
    accentHsl: "265 55% 55%",
  },
  {
    id: "relacionamento",
    icon: Heart,
    title: "Elevve seu relacionamento",
    description: "Transforme sua conexão através do autoconhecimento.",
    accentHsl: "320 60% 55%",
  },
  {
    id: "vida-amorosa",
    icon: Sparkles,
    title: "Elevve sua vida amorosa",
    description: "Atraia e cultive o amor com energia elevada.",
    accentHsl: "280 50% 60%",
  },
  {
    id: "financeira",
    icon: Wallet,
    title: "Elevve sua vida financeira",
    description: "Desbloqueie a abundância com mentalidade expandida.",
    accentHsl: "40 82% 62%",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ElevveSe = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen pt-20 pb-28 md:pb-16 px-5 sm:px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(265 55% 55%), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(40 82% 62%), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto max-w-lg relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            <span className="text-gradient-gold">Elevve-se</span>
          </h1>
          <p className="text-muted-foreground/80 text-sm leading-relaxed max-w-xs mx-auto">
            Escolha uma área da sua vida para evoluir com consciência
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="flex flex-col gap-3.5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {topics.map((topic) => (
            <motion.button
              key={topic.id}
              variants={cardVariants}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              aria-label={topic.title}
              className="group relative w-full text-left rounded-[20px] border border-border/40 bg-card/80 backdrop-blur-sm p-5 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
              style={{
                boxShadow: `0 0 0 0 transparent`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 32px -8px hsl(${topic.accentHsl} / 0.2)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 transparent`;
              }}
            >
              {/* Subtle gradient overlay on hover */}
              <div
                className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, hsl(${topic.accentHsl} / 0.06), transparent 60%)`,
                }}
              />

              <div className="relative flex items-center gap-4">
                {/* Icon container */}
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-2xl border border-border/30 shrink-0 transition-all duration-300 group-hover:border-transparent"
                  style={{
                    background: `linear-gradient(145deg, hsl(${topic.accentHsl} / 0.12), hsl(${topic.accentHsl} / 0.04))`,
                  }}
                >
                  <topic.icon
                    className="h-5 w-5 transition-all duration-300"
                    style={{ color: `hsl(${topic.accentHsl})` }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] font-semibold text-foreground mb-0.5 truncate">
                    {topic.title}
                  </h2>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors duration-300 shrink-0" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default ElevveSe;
