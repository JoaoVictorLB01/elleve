import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const messagesPt = [
  "Grandes coisas estão a caminho.",
  "Confie no seu processo.",
  "Hoje é um ótimo dia para recomeçar.",
  "Sua energia atrai o que você vibra.",
  "O universo está conspirando ao seu favor.",
  "Você é mais forte do que imagina.",
  "Permita-se florescer no seu tempo.",
  "A luz que você procura já está dentro de você.",
  "Liberte o que não te pertence mais.",
  "Cada passo conta, mesmo os pequenos.",
  "Sua intuição é sua melhor bússola.",
  "Acolha suas transformações com gratidão.",
  "O melhor ainda está por vir.",
  "Você merece tudo aquilo que deseja.",
  "Respire fundo. Você está exatamente onde precisa estar.",
  "Sua jornada é única e sagrada.",
  "Abra espaço para o novo chegar.",
  "A calma é sua maior força.",
];

const messagesEn = [
  "Great things are on their way.",
  "Trust your process.",
  "Today is a great day to start over.",
  "Your energy attracts what you vibrate.",
  "The universe is conspiring in your favor.",
  "You are stronger than you think.",
  "Allow yourself to bloom in your own time.",
  "The light you seek is already within you.",
  "Release what no longer serves you.",
  "Every step counts, even the small ones.",
  "Your intuition is your best compass.",
  "Embrace your transformations with gratitude.",
  "The best is yet to come.",
  "You deserve everything you desire.",
  "Breathe deeply. You are exactly where you need to be.",
  "Your journey is unique and sacred.",
  "Make space for the new to arrive.",
  "Stillness is your greatest strength.",
];

const messagesFr = [
  "De grandes choses arrivent.",
  "Faites confiance à votre processus.",
  "Aujourd'hui est un bon jour pour recommencer.",
  "Votre énergie attire ce que vous vibrez.",
  "L'univers conspire en votre faveur.",
  "Vous êtes plus fort(e) que vous ne le pensez.",
  "Permettez-vous de fleurir à votre rythme.",
  "La lumière que vous cherchez est déjà en vous.",
  "Libérez ce qui ne vous appartient plus.",
  "Chaque pas compte, même les petits.",
  "Votre intuition est votre meilleure boussole.",
  "Accueillez vos transformations avec gratitude.",
  "Le meilleur reste à venir.",
  "Vous méritez tout ce que vous désirez.",
  "Respirez profondément. Vous êtes exactement où vous devez être.",
  "Votre voyage est unique et sacré.",
  "Faites de la place pour le nouveau.",
  "Le calme est votre plus grande force.",
];

const messagesEs = [
  "Grandes cosas están en camino.",
  "Confía en tu proceso.",
  "Hoy es un gran día para empezar de nuevo.",
  "Tu energía atrae lo que vibras.",
  "El universo está conspirando a tu favor.",
  "Eres más fuerte de lo que imaginas.",
  "Permítete florecer a tu tiempo.",
  "La luz que buscas ya está dentro de ti.",
  "Libera lo que ya no te pertenece.",
  "Cada paso cuenta, incluso los pequeños.",
  "Tu intuición es tu mejor brújula.",
  "Abraza tus transformaciones con gratitud.",
  "Lo mejor está por venir.",
  "Mereces todo lo que deseas.",
  "Respira profundo. Estás exactamente donde necesitas estar.",
  "Tu camino es único y sagrado.",
  "Abre espacio para lo nuevo.",
  "La calma es tu mayor fuerza.",
];

const allMessages: Record<string, string[]> = {
  pt: messagesPt,
  en: messagesEn,
  fr: messagesFr,
  es: messagesEs,
};

const OracleCard = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [message, setMessage] = useState("");
  const [lastIndex, setLastIndex] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const messages = allMessages[language] || allMessages.pt;

  const getRandomMessage = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * messages.length);
    } while (idx === lastIndex && messages.length > 1);
    setLastIndex(idx);
    return messages[idx];
  }, [messages, lastIndex]);

  const generateSparkles = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      delay: Math.random() * 0.3,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1200);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsFlipping(true);
    setRevealed(false);
    const msg = getRandomMessage();
    setTimeout(() => {
      setMessage(msg);
      setRevealed(true);
      setIsFlipping(false);
      generateSparkles();
    }, 800);
  };

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setRevealed(false);
    setTimeout(() => {
      const msg = getRandomMessage();
      setMessage(msg);
      setRevealed(true);
      setIsFlipping(false);
      generateSparkles();
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    setRevealed(false);
    setMessage("");
  };

  // Floating sparkle particles for the card
  const [floatingParticles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 280 - 140,
      y: Math.random() * 380 - 190,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
    }))
  );

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-50 blur-md group-hover:opacity-80 transition-opacity animate-pulse" />
          <div className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-primary/30 shadow-xl shadow-primary/10">
            <Sparkles className="h-4.5 w-4.5 text-accent" />
            <span className="text-sm font-semibold text-foreground">{t("oracle.button")}</span>
          </div>
        </div>
      </motion.button>

      {/* Overlay & Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Card container */}
            <motion.div
              className="relative cursor-pointer"
              onClick={handleFlip}
              initial={{ scale: 0.3, y: 300, rotateY: 180, opacity: 0 }}
              animate={{
                scale: 1,
                y: 0,
                rotateY: isFlipping ? 180 : 0,
                opacity: 1,
              }}
              exit={{ scale: 0.5, y: 200, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 0.8,
              }}
              style={{ perspective: 1000, transformStyle: "preserve-3d" }}
            >
              {/* Sparkle burst on reveal */}
              {sparkles.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.8, delay: s.delay, ease: "easeOut" }}
                >
                  <Sparkles className="h-3 w-3 text-accent" />
                </motion.div>
              ))}

              {/* Floating ambient particles */}
              {floatingParticles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute top-1/2 left-1/2 rounded-full bg-accent/40 pointer-events-none"
                  style={{ width: p.size, height: p.size }}
                  animate={{
                    x: [p.x, p.x + 20, p.x],
                    y: [p.y, p.y - 30, p.y],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* The card itself */}
              <div className="relative w-[280px] sm:w-[320px] overflow-hidden rounded-3xl border border-primary/20 shadow-2xl shadow-primary/15">
                {/* Glow border */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-accent/30 via-primary/20 to-accent/30 -z-10 blur-sm" />

                {/* Card background */}
                <div className="relative bg-gradient-to-b from-card via-[hsl(var(--surface-elevated))] to-card p-8 sm:p-10">
                  {/* Top ornament */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center"
                    >
                      <Sparkles className="h-4 w-4 text-accent" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-6">
                    {t("oracle.title")}
                  </h3>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/40" />
                  </div>

                  {/* Message */}
                  <div className="min-h-[80px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {revealed && message && (
                        <motion.p
                          key={message}
                          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="text-center text-base sm:text-lg font-medium text-foreground leading-relaxed"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          "{message}"
                        </motion.p>
                      )}
                      {!revealed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.4 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-1"
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom divider */}
                  <div className="flex items-center justify-center gap-3 mt-8 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/40" />
                  </div>

                  {/* Hint */}
                  <motion.p
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-center text-[10px] sm:text-[11px] text-muted-foreground tracking-wider uppercase"
                  >
                    {t("oracle.hint")}
                  </motion.p>
                </div>
              </div>

              {/* Floating animation for the whole card */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OracleCard;
