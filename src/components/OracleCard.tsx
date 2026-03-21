import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AuthGateModal from "@/components/AuthGateModal";
import { useAuth } from "@/contexts/AuthContext";
import tarotBack from "@/assets/tarot-card-back.png";
import tarotFront from "@/assets/tarot-card-front.png";

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
  "Great things are on their way.", "Trust your process.", "Today is a great day to start over.",
  "Your energy attracts what you vibrate.", "The universe is conspiring in your favor.",
  "You are stronger than you think.", "Allow yourself to bloom in your own time.",
  "The light you seek is already within you.", "Release what no longer serves you.",
  "Every step counts, even the small ones.", "Your intuition is your best compass.",
  "Embrace your transformations with gratitude.", "The best is yet to come.",
  "You deserve everything you desire.", "Breathe deeply. You are exactly where you need to be.",
  "Your journey is unique and sacred.", "Make space for the new to arrive.",
  "Stillness is your greatest strength.",
];
const messagesFr = [
  "De grandes choses arrivent.", "Faites confiance à votre processus.",
  "Aujourd'hui est un bon jour pour recommencer.", "Votre énergie attire ce que vous vibrez.",
  "L'univers conspire en votre faveur.", "Vous êtes plus fort(e) que vous ne le pensez.",
  "Permettez-vous de fleurir à votre rythme.", "La lumière que vous cherchez est déjà en vous.",
  "Libérez ce qui ne vous appartient plus.", "Chaque pas compte, même les petits.",
  "Votre intuition est votre meilleure boussole.", "Accueillez vos transformations avec gratitude.",
  "Le meilleur reste à venir.", "Vous méritez tout ce que vous désirez.",
  "Respirez profondément. Vous êtes exactement où vous devez être.",
  "Votre voyage est unique et sacré.", "Faites de la place pour le nouveau.",
  "Le calme est votre plus grande force.",
];
const messagesEs = [
  "Grandes cosas están en camino.", "Confía en tu proceso.",
  "Hoy es un gran día para empezar de nuevo.", "Tu energía atrae lo que vibras.",
  "El universo está conspirando a tu favor.", "Eres más fuerte de lo que imaginas.",
  "Permítete florecer a tu tiempo.", "La luz que buscas ya está dentro de ti.",
  "Libera lo que ya no te pertenece.", "Cada paso cuenta, incluso los pequeños.",
  "Tu intuición es tu mejor brújula.", "Abraza tus transformaciones con gratitud.",
  "Lo mejor está por venir.", "Mereces todo lo que deseas.",
  "Respira profundo. Estás exactamente donde necesitas estar.",
  "Tu camino es único y sagrado.", "Abre espacio para lo nuevo.",
  "La calma es tu mayor fuerza.",
];

const allMessages: Record<string, string[]> = { pt: messagesPt, en: messagesEn, fr: messagesFr, es: messagesEs };

// Generate a soft chime sound using Web Audio API
function playFlipSound() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // Reverb via convolver (simple impulse)
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const reverbLength = sampleRate * 1.5;
    const impulse = ctx.createBuffer(2, reverbLength, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < reverbLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2.5);
      }
    }
    convolver.buffer = impulse;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, t);
    masterGain.connect(ctx.destination);

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.08, t);
    convolver.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    // Layer 1: Crystal bowl — warm fundamental
    const bowl = ctx.createOscillator();
    const bowlGain = ctx.createGain();
    bowl.type = "sine";
    bowl.frequency.setValueAtTime(528, t); // "healing" frequency
    bowl.frequency.exponentialRampToValueAtTime(396, t + 1.8);
    bowlGain.gain.setValueAtTime(0.14, t);
    bowlGain.gain.setValueAtTime(0.14, t + 0.3);
    bowlGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
    bowl.connect(bowlGain);
    bowlGain.connect(masterGain);
    bowlGain.connect(convolver);
    bowl.start(t);
    bowl.stop(t + 2.0);

    // Layer 2: High shimmer — delicate bell overtone
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1584, t + 0.02); // 3rd harmonic
    shimmer.frequency.exponentialRampToValueAtTime(1056, t + 1.5);
    shimmerGain.gain.setValueAtTime(0.05, t + 0.02);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerGain.connect(convolver);
    shimmer.start(t + 0.02);
    shimmer.stop(t + 1.5);

    // Layer 3: Sparkle attack — short bright ping
    const ping = ctx.createOscillator();
    const pingGain = ctx.createGain();
    ping.type = "triangle";
    ping.frequency.setValueAtTime(2112, t);
    ping.frequency.exponentialRampToValueAtTime(1056, t + 0.15);
    pingGain.gain.setValueAtTime(0.08, t);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    ping.connect(pingGain);
    pingGain.connect(masterGain);
    ping.start(t);
    ping.stop(t + 0.3);

    // Layer 4: Sub warmth — gentle low hum
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(132, t + 0.05);
    subGain.gain.setValueAtTime(0.06, t + 0.05);
    subGain.gain.setValueAtTime(0.06, t + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    sub.connect(subGain);
    subGain.connect(masterGain);
    sub.start(t + 0.05);
    sub.stop(t + 1.8);

    setTimeout(() => ctx.close(), 3000);
  } catch {
    // Silently fail
  }
}

const OracleCard = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [lastIndex, setLastIndex] = useState(-1);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const messages = allMessages[language] || allMessages.pt;

  // Get user's first name
  const userName = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(" ")[0]
    : null;

  const getRandomMessage = useCallback(() => {
    let idx: number;
    do { idx = Math.floor(Math.random() * messages.length); } while (idx === lastIndex && messages.length > 1);
    setLastIndex(idx);
    return messages[idx];
  }, [messages, lastIndex]);

  const generateSparkles = () => {
    setSparkles(Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 240 - 120,
      y: Math.random() * 340 - 170,
      delay: Math.random() * 0.4,
    })));
    setTimeout(() => setSparkles([]), 1500);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsAnimating(true);
    setIsFlipped(false);
    setTimeout(() => {
      setIsFlipped(true);
      setMessage(getRandomMessage());
      generateSparkles();
      playFlipSound();
      setTimeout(() => setIsAnimating(false), 600);
    }, 700);
  };

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(false);
    playFlipSound();
    setTimeout(() => {
      setMessage(getRandomMessage());
      setIsFlipped(true);
      generateSparkles();
      setTimeout(() => setIsAnimating(false), 600);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFlipped(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating trigger */}
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
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-50 blur-md group-hover:opacity-80 transition-opacity animate-pulse" />
          <div className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-primary/30 shadow-xl shadow-primary/10">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">{t("oracle.button")}</span>
          </div>
        </div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-lg"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 3D Card */}
            <motion.div
              className="relative cursor-pointer"
              style={{ perspective: 1200 }}
              onClick={handleFlip}
              initial={{ scale: 0.2, y: 400, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.4, y: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 80 }}
            >
              {/* Sparkle burst */}
              {sparkles.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-20"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.8 }}
                  transition={{ duration: 1, delay: s.delay, ease: "easeOut" }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent drop-shadow-lg" />
                </motion.div>
              ))}

              {/* Flipping card */}
              <motion.div
                className="relative w-[260px] sm:w-[300px]"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: isFlipped ? 0 : 180,
                  y: [0, -5, 0],
                }}
                transition={{
                  rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {/* Front face (message) */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={tarotFront}
                    alt=""
                    className="w-full aspect-[640/1024] object-cover"
                    draggable={false}
                  />

                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-between py-[10%] px-6">
                    {/* Title */}
                    <p
                      className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-accent drop-shadow-lg"
                    >
                      {t("oracle.title")}
                    </p>

                    {/* Message */}
                    <div className="flex-1 flex items-center justify-center w-full px-2">
                      <AnimatePresence mode="wait">
                        {message && (
                          <motion.p
                            key={message}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="text-center text-base sm:text-lg font-semibold leading-relaxed text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            "{message}"
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom area: user name + hint */}
                    <div className="flex flex-col items-center gap-3">
                      {userName && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-accent/50" />
                            <span className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-accent/70 font-medium">
                              {t("oracle.for")}
                            </span>
                            <div className="h-px w-6 bg-accent/50" />
                          </div>
                          <p
                            className="text-sm sm:text-base font-semibold text-white/90 drop-shadow-lg"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {userName}
                          </p>
                        </motion.div>
                      )}

                      <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-[9px] sm:text-[10px] tracking-wider uppercase text-white/40"
                      >
                        {t("oracle.hint")}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <img
                    src={tarotBack}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OracleCard;
