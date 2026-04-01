import { motion } from "framer-motion";
import { Heart, Users, Sparkles, Wallet, Baby, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import ElevveParticles from "@/components/ElevveParticles";

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

const kidsTopics = [
  {
    id: "autoestima",
    icon: "🌟",
    title: "Autoestima e confiança",
    description: "Ajude seu filho a acreditar no próprio potencial.",
    accentHsl: "45 90% 58%",
  },
  {
    id: "emocoes",
    icon: "🧠",
    title: "Inteligência emocional",
    description: "Ensine a identificar e lidar com as emoções.",
    accentHsl: "200 70% 55%",
  },
  {
    id: "criatividade",
    icon: "🎨",
    title: "Criatividade e imaginação",
    description: "Estimule o pensamento criativo e a expressão artística.",
    accentHsl: "330 65% 60%",
  },
  {
    id: "valores",
    icon: "💛",
    title: "Valores e empatia",
    description: "Construa uma base sólida de respeito e compaixão.",
    accentHsl: "280 50% 58%",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const ElevveSe = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-16 px-5 sm:px-6 relative overflow-hidden">
      {/* Reduced ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(265 55% 55%), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(40 82% 62%), transparent 70%)" }}
        />
      </div>

      {/* Reduced particles */}
      <ElevveParticles count={10} />

      <div className="container mx-auto max-w-lg relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-7"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5">
            <span className="text-gradient-gold">Elevve-se</span>
          </h1>
          <p className="text-muted-foreground/75 text-sm leading-relaxed max-w-xs mx-auto">
            Escolha uma área da sua vida para evoluir com consciência
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {topics.map((topic) => (
            <motion.div key={topic.id} variants={cardVariants}>
              <Link
                to={`/elevve-se/${topic.id}`}
                className="group relative w-full text-left rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-4.5 cursor-pointer transition-shadow duration-300 hover:shadow-lg block"
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px -8px hsl(${topic.accentHsl} / 0.18)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: `linear-gradient(135deg, hsl(${topic.accentHsl} / 0.05), transparent 60%)`,
                  }}
                />

                <div className="relative flex items-center gap-3.5">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/25 shrink-0 transition-all duration-300 group-hover:border-transparent"
                    style={{
                      background: `linear-gradient(145deg, hsl(${topic.accentHsl} / 0.1), hsl(${topic.accentHsl} / 0.03))`,
                    }}
                  >
                    <topic.icon
                      className="h-[18px] w-[18px] transition-all duration-300"
                      style={{ color: `hsl(${topic.accentHsl})` }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-foreground mb-0.5 truncate">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-muted-foreground/65 leading-relaxed line-clamp-2">
                      {topic.description}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground/25 group-hover:text-muted-foreground/50 transition-colors duration-300 shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Elevve Kids Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(45_90%_58%_/_0.12)] to-[hsl(330_65%_60%_/_0.06)] border border-border/25">
              <Baby className="h-4 w-4 text-[hsl(45_90%_58%)]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                <span className="text-gradient-gold">Elevve Kids</span>
              </h2>
              <p className="text-[10px] text-muted-foreground/55 leading-tight">
                Desenvolvimento infantil consciente
              </p>
            </div>
          </div>

          <motion.div
            className="flex flex-col gap-2.5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {kidsTopics.map((topic) => (
              <motion.button
                key={topic.id}
                variants={cardVariants}
                whileTap={{ scale: 0.975 }}
                aria-label={topic.title}
                className="group relative w-full text-left rounded-xl border border-border/25 bg-card/50 backdrop-blur-sm p-3.5 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px -6px hsl(${topic.accentHsl} / 0.15)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: `linear-gradient(135deg, hsl(${topic.accentHsl} / 0.04), transparent 60%)`,
                  }}
                />

                <div className="relative flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-border/15 shrink-0 text-base"
                    style={{
                      background: `linear-gradient(145deg, hsl(${topic.accentHsl} / 0.08), hsl(${topic.accentHsl} / 0.02))`,
                    }}
                  >
                    {topic.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold text-foreground mb-0.5 truncate">
                      {topic.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed line-clamp-1">
                      {topic.description}
                    </p>
                  </div>

                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/45 transition-colors duration-300 shrink-0" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default ElevveSe;
