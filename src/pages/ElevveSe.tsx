import { motion } from "framer-motion";
import { Heart, Users, Sparkles, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const topics = [
  {
    id: "familia",
    icon: Users,
    title: "Elevve sua família",
    description: "Fortaleça os laços familiares com consciência e amor.",
    gradient: "from-primary/20 to-primary/5",
    glowColor: "shadow-primary/20",
    iconColor: "text-primary",
  },
  {
    id: "relacionamento",
    icon: Heart,
    title: "Elevve seu relacionamento",
    description: "Transforme sua conexão através do autoconhecimento.",
    gradient: "from-accent/15 to-accent/5",
    glowColor: "shadow-accent/20",
    iconColor: "text-accent",
  },
  {
    id: "vida-amorosa",
    icon: Sparkles,
    title: "Elevve sua vida amorosa",
    description: "Atraia e cultive o amor com energia elevada.",
    gradient: "from-primary/15 to-accent/10",
    glowColor: "shadow-primary/15",
    iconColor: "text-primary",
  },
  {
    id: "financeira",
    icon: Wallet,
    title: "Elevve sua vida financeira",
    description: "Desbloqueie a abundância com mentalidade expandida.",
    gradient: "from-accent/20 to-accent/5",
    glowColor: "shadow-accent/25",
    iconColor: "text-accent",
  },
];

const ElevveSe = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen pt-20 pb-28 md:pb-16 px-5 sm:px-6">
      <div className="container mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="text-gradient-gold">Elevve-se</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Escolha a área da sua vida que deseja transformar e evolua com consciência.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {topics.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label={topic.title}
              className={`group relative w-full text-left rounded-2xl border border-border/60 bg-gradient-to-br ${topic.gradient} p-5 sm:p-6 shadow-lg ${topic.glowColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border/40 ${topic.iconColor}`}>
                  <topic.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                    {topic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ElevveSe;
