import { Link } from "react-router-dom";
import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, ArrowRight, Star, Users, BookOpen, Award,
  Zap, Eye, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const HeroParticles = lazy(() => import("@/components/HeroParticles"));

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const Index = () => {
  const featuredCourses = courses.filter((c) => c.featured);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // Parallax transforms for different sections
  const heroBgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.25], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 0.15], ["0%", "-8%"]);
  const featuresFloat = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "-5%"]);
  const philosophyScale = useTransform(scrollYProgress, [0.5, 0.7], [0.95, 1]);
  const ctaY = useTransform(scrollYProgress, [0.7, 1], ["40px", "0px"]);

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroBg})`, y: heroBgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <motion.div
          className="absolute inset-0 opacity-[0.03] hidden sm:block"
          style={{
            backgroundImage: `linear-gradient(hsl(265 55% 52% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(265 55% 52% / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            y: gridY,
          }}
        />

        {/* 3D Particles */}
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>

        <motion.div
          className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <motion.div {...fadeUp}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-5 sm:mb-8 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border bg-muted/40 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent animate-pulse-slow" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground tracking-wider uppercase">
                Plataforma de Evolução Pessoal
              </span>
            </motion.div>

            <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Eleve sua
              <br />
              <span className="text-gradient-cosmic">consciência</span>
            </h1>

            <p className="text-[13px] sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed px-1">
              Cursos transformadores sobre energia, cura e autoconhecimento.
              Desperte o potencial que já existe dentro de você.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
              <Button variant="cosmic" size="lg" className="w-full sm:w-auto sm:min-w-[200px] h-12 sm:h-11 text-[15px] sm:text-sm" asChild>
                <Link to="/cursos">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-[200px] h-12 sm:h-11 text-[15px] sm:text-sm border-border/60" asChild>
                <Link to="/cadastro">Criar Conta Gratuita</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
            {[
              { icon: BookOpen, label: "Cursos", value: "15+", color: "text-primary" },
              { icon: Users, label: "Alunos Ativos", value: "1.200+", color: "text-primary" },
              { icon: Star, label: "Avaliação Média", value: "4.9", color: "text-accent" },
              { icon: Award, label: "Certificados", value: "800+", color: "text-primary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card/50"
              >
                <stat.icon className={`h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1.5 sm:mb-3 ${stat.color}`} />
                <div className="text-lg sm:text-3xl font-bold mb-0.5 sm:mb-1">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 sm:py-20 relative">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3"
          >
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 sm:mb-3 block">
                Destaques
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                Cursos em Destaque
              </h2>
            </div>
            <Link
              to="/cursos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20 bg-gradient-cosmic-subtle relative overflow-hidden">
        {/* Parallax decorative orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, hsl(265 55% 52%), transparent 70%)",
            y: featuresFloat,
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, hsl(40 80% 58%), transparent 70%)",
            y: featuresFloat,
          }}
        />

        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 sm:mb-3 block">
              Por que Elleve?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold px-2">
              Uma plataforma feita para sua <span className="text-gradient-gold">evolução</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: Zap,
                title: "Conteúdo Transformador",
                desc: "Cursos criados por especialistas com décadas de experiência em desenvolvimento humano e práticas energéticas.",
              },
              {
                icon: Eye,
                title: "Aprendizado no seu Ritmo",
                desc: "Assista quando quiser, de onde quiser. Seu progresso é salvo automaticamente para que nunca perca uma aula.",
              },
              {
                icon: Heart,
                title: "Certificação Reconhecida",
                desc: "Receba certificados ao concluir cada curso e compartilhe suas conquistas na sua jornada de evolução.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true, margin: "-30px" }}
                className="p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-border bg-card/50 text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 mb-4 sm:mb-5">
                  <feature.icon className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <motion.div
          className="container mx-auto px-5 sm:px-6 max-w-3xl text-center"
          style={{ scale: philosophyScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 mb-6 sm:mb-8">
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-accent" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
              A Filosofia <span className="text-gradient-gold">Elleve</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.8] mb-4 sm:mb-6">
              Acreditamos que cada ser humano carrega dentro de si uma luz única, uma energia
              pronta para ser despertada. A Elleve é mais do que uma plataforma de cursos — é
              um portal de transformação, onde conhecimento ancestral encontra ferramentas
              modernas de evolução pessoal.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.8]">
              Nossos instrutores são guias experientes que dedicaram suas vidas ao estudo da
              energia, consciência e cura. Cada curso é uma jornada cuidadosamente desenhada
              para elevar sua frequência e expandir sua percepção.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ y: ctaY }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-cosmic" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(40 80% 58% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(265 55% 70% / 0.3) 0%, transparent 50%)`
            }} />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-5 text-primary-foreground leading-tight">
                Pronto para sua
                <br />
                transformação?
              </h2>
              <p className="text-[13px] sm:text-base text-primary-foreground/70 mb-6 sm:mb-10 max-w-md mx-auto leading-relaxed">
                Comece sua jornada de evolução pessoal hoje. Acesse cursos exclusivos e
                conecte-se com sua melhor versão.
              </p>
              <Button variant="gold" size="lg" className="w-full sm:w-auto sm:min-w-[220px] h-12 sm:h-11 text-[15px] sm:text-sm" asChild>
                <Link to="/cadastro">
                  Começar Agora
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
