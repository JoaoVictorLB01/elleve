import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AuthGateModal from "@/components/AuthGateModal";
import tarotBack from "@/assets/tarot-card-back.png";
import tarotFront from "@/assets/tarot-card-front.png";
import oracleCardImg from "@/assets/oracle-card-front.png";

const messagesPt = [
  "A verdadeira transformação começa no silêncio entre os pensamentos.",
  "Quem domina a própria energia, domina o próprio destino.",
  "O universo não te dá o que você pede — te dá o que você vibra.",
  "Há uma sabedoria antiga dentro de você esperando ser ouvida.",
  "Não é sobre encontrar a luz, é sobre lembrar que você é a luz.",
  "Toda grande jornada começa com a coragem de dar o primeiro passo em direção a si mesmo.",
  "A alma que se conhece não teme o desconhecido.",
  "Sua frequência é seu convite — eleve-a e observe o que chega.",
  "O caos que você atravessa hoje é o alicerce da paz que você constrói amanhã.",
  "Permita que o universo reorganize o que sua mente não consegue compreender.",
  "A cura não é linear, mas cada camada que você libera te aproxima da sua essência.",
  "Você não está recomeçando — está evoluindo com mais consciência.",
  "O que você semeia em silêncio, o tempo revela em abundância.",
  "Confie no ritmo da sua própria expansão. Nada floresce fora do seu tempo.",
  "Existe uma força em você que já sobreviveu a tudo que já tentou te quebrar.",
  "A intuição é a voz da alma — aprenda a ouvi-la sem questioná-la.",
  "Quando você se alinha com o seu propósito, o caminho se ilumina sozinho.",
  "Solte o peso do que não te pertence. Sua energia é sagrada demais para carregar o que não é seu.",
  "O presente é o único lugar onde sua energia pode criar algo real.",
  "A gratidão não muda o que aconteceu — muda a frequência do que está por vir.",
];
const messagesEn = [
  "True transformation begins in the silence between thoughts.",
  "Those who master their own energy, master their own destiny.",
  "The universe doesn't give you what you ask for — it gives you what you vibrate.",
  "There is ancient wisdom within you waiting to be heard.",
  "It's not about finding the light — it's about remembering that you are the light.",
  "Every great journey begins with the courage to take the first step toward yourself.",
  "The soul that knows itself does not fear the unknown.",
  "Your frequency is your invitation — raise it and observe what arrives.",
  "The chaos you cross today is the foundation of the peace you build tomorrow.",
  "Allow the universe to rearrange what your mind cannot comprehend.",
  "Healing is not linear, but every layer you release brings you closer to your essence.",
  "You are not starting over — you are evolving with greater awareness.",
  "What you sow in silence, time reveals in abundance.",
  "Trust the rhythm of your own expansion. Nothing blooms outside its time.",
  "There is a strength in you that has already survived everything that tried to break you.",
  "Intuition is the voice of the soul — learn to listen without questioning it.",
  "When you align with your purpose, the path illuminates itself.",
  "Release the weight of what doesn't belong to you. Your energy is too sacred to carry what isn't yours.",
  "The present is the only place where your energy can create something real.",
  "Gratitude doesn't change what happened — it changes the frequency of what's to come.",
];
const messagesFr = [
  "La vraie transformation commence dans le silence entre les pensées.",
  "Celui qui maîtrise sa propre énergie maîtrise son propre destin.",
  "L'univers ne vous donne pas ce que vous demandez — il vous donne ce que vous vibrez.",
  "Il y a une sagesse ancienne en vous qui attend d'être entendue.",
  "Il ne s'agit pas de trouver la lumière — mais de se rappeler que vous êtes la lumière.",
  "Tout grand voyage commence par le courage de faire le premier pas vers soi-même.",
  "L'âme qui se connaît ne craint pas l'inconnu.",
  "Votre fréquence est votre invitation — élevez-la et observez ce qui arrive.",
  "Le chaos que vous traversez aujourd'hui est le fondement de la paix que vous construisez demain.",
  "Permettez à l'univers de réorganiser ce que votre esprit ne peut comprendre.",
  "La guérison n'est pas linéaire, mais chaque couche que vous libérez vous rapproche de votre essence.",
  "Vous ne recommencez pas — vous évoluez avec plus de conscience.",
  "Ce que vous semez en silence, le temps le révèle en abondance.",
  "Faites confiance au rythme de votre propre expansion. Rien ne fleurit hors de son temps.",
  "Il y a une force en vous qui a déjà survécu à tout ce qui a tenté de vous briser.",
  "L'intuition est la voix de l'âme — apprenez à l'écouter sans la questionner.",
  "Quand vous vous alignez avec votre but, le chemin s'illumine de lui-même.",
  "Libérez le poids de ce qui ne vous appartient pas. Votre énergie est trop sacrée.",
  "Le présent est le seul endroit où votre énergie peut créer quelque chose de réel.",
  "La gratitude ne change pas ce qui s'est passé — elle change la fréquence de ce qui vient.",
];
const messagesEs = [
  "La verdadera transformación comienza en el silencio entre los pensamientos.",
  "Quien domina su propia energía, domina su propio destino.",
  "El universo no te da lo que pides — te da lo que vibras.",
  "Hay una sabiduría antigua dentro de ti esperando ser escuchada.",
  "No se trata de encontrar la luz — se trata de recordar que tú eres la luz.",
  "Todo gran viaje comienza con el coraje de dar el primer paso hacia ti mismo.",
  "El alma que se conoce no teme lo desconocido.",
  "Tu frecuencia es tu invitación — elévala y observa lo que llega.",
  "El caos que atraviesas hoy es el cimiento de la paz que construyes mañana.",
  "Permite que el universo reorganice lo que tu mente no puede comprender.",
  "La sanación no es lineal, pero cada capa que liberas te acerca a tu esencia.",
  "No estás empezando de nuevo — estás evolucionando con más conciencia.",
  "Lo que siembras en silencio, el tiempo lo revela en abundancia.",
  "Confía en el ritmo de tu propia expansión. Nada florece fuera de su tiempo.",
  "Hay una fuerza en ti que ya sobrevivió a todo lo que intentó quebrarte.",
  "La intuición es la voz del alma — aprende a escucharla sin cuestionarla.",
  "Cuando te alineas con tu propósito, el camino se ilumina solo.",
  "Suelta el peso de lo que no te pertenece. Tu energía es demasiado sagrada.",
  "El presente es el único lugar donde tu energía puede crear algo real.",
  "La gratitud no cambia lo que pasó — cambia la frecuencia de lo que está por venir.",
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
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    setIsOpen(true);
    setIsFlipped(false);
    setIsAnimating(false);
    setMessage(getRandomMessage());
  };

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isFlipped) {
      // First flip: reveal the message
      setIsFlipped(true);
      generateSparkles();
      playFlipSound();
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      // Subsequent flips: hide → change message → reveal
      setIsFlipped(false);
      playFlipSound();
      setTimeout(() => {
        setMessage(getRandomMessage());
        setIsFlipped(true);
        generateSparkles();
        setTimeout(() => setIsAnimating(false), 600);
      }, 600);
    }
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
        className="fixed bottom-[76px] md:bottom-6 right-5 z-40 group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Oráculo do Dia"
      >
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-lg group-hover:opacity-70 transition-opacity animate-pulse-slow" />
          <img
            src={oracleCardImg}
            alt="Oráculo do Dia - Carta de Tarô"
            className="relative h-[72px] md:h-[88px] w-auto rounded-lg shadow-xl shadow-primary/25 border border-primary/20"
            draggable={false}
          />
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
                            className="text-center text-[15px] sm:text-lg font-medium leading-[1.6] tracking-wide text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.01em" }}
                          >
                            {message}
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
                  {/* Pulsing glow overlay when card is face-down */}
                  {!isFlipped && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 30px rgba(212,175,55,0.0), 0 0 20px rgba(212,175,55,0.1)",
                          "inset 0 0 40px rgba(212,175,55,0.15), 0 0 40px rgba(212,175,55,0.25)",
                          "inset 0 0 30px rgba(212,175,55,0.0), 0 0 20px rgba(212,175,55,0.1)",
                        ],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  {/* "Toque para revelar" hint */}
                  {!isFlipped && (
                    <motion.p
                      className="absolute bottom-5 left-0 right-0 text-center text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-accent/80 font-medium drop-shadow-lg"
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {t("oracle.hint")}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthGateModal open={showAuthGate} onClose={() => setShowAuthGate(false)} redirectTo="/" />
    </>
  );
};

export default OracleCard;
