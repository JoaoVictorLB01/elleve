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
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroParticles = lazy(() => import("@/components/HeroParticles"));

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const Index = () => {
  const { t } = useLanguage();
  const featuredCourses = courses.filter((c) => c.featured);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const heroBgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.25], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 0.15], ["0%", "-8%"]);
  const featuresFloat = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "-5%"]);
  const philosophyScale = useTransform(scrollYProgress, [0.5, 0.7], [0.95, 1]);
  const ctaY = useTransform(scrollYProgress, [0.7, 1], ["40px", "0px"]);

  const stats = [
    { icon: BookOpen, label: t("stats.courses"), value: "15+", color: "text-primary" },
    { icon: Users, label: t("stats.activeStudents"), value: "1.200+", color: "text-primary" },
    { icon: Star, label: t("stats.avgRating"), value: "4.9", color: "text-accent" },
    { icon: Award, label: t("stats.certificates"), value: "800+", color: "text-primary" },
  ];

  const features = [
    { icon: Zap, title: t("features.1.title"), desc: t("features.1.desc") },
    { icon: Eye, title: t("features.2.title"), desc: t("features.2.desc") },
    { icon: Heart, title: t("features.3.title"), desc: t("features.3.desc") },
  ];

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroBg})`, y: heroBgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
        
        <motion.div
          className="absolute inset-0 opacity-[0.03] hidden sm:block"
          style={{
            backgroundImage: `linear-gradient(hsl(265 55% 52% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(265 55% 52% / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            y: gridY,
          }}
        />

        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>

        <motion.div
          className="relative z-10 container mx-auto px-6 sm:px-6 text-center pt-24 sm:pt-0"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <motion.div {...fadeUp}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 sm:px-4 sm:py-2 rounded-full border border-border bg-muted/40 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 text-accent animate-pulse-slow" />
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground tracking-wider uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <h1 className="text-[2.75rem] leading-[1.08] sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-5 sm:mb-6 tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              {t("hero.title1")}
              <br />
              <span className="text-gradient-cosmic">{t("hero.title2")}</span>
            </h1>

            <p className="text-base sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 sm:mb-12 leading-[1.7] px-2 sm:px-1">
              {t("hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full px-2 sm:px-0">
              <Button variant="cosmic" size="lg" className="w-full sm:w-auto sm:min-w-[200px] h-[52px] sm:h-11 text-base sm:text-sm rounded-xl active:scale-[0.97]" asChild>
                <Link to="/cursos">
                  {t("hero.explore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-[200px] h-[52px] sm:h-11 text-base sm:text-sm border-border/60 rounded-xl active:scale-[0.97]" asChild>
                <Link to="/cadastro">{t("hero.createAccount")}</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm active:scale-[0.97] transition-transform"
              >
                <stat.icon className={`h-5 w-5 mx-auto mb-2.5 ${stat.color}`} />
                <div className="text-[1.5rem] sm:text-3xl font-bold mb-0.5 tracking-tight">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 sm:py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-7 sm:mb-12"
          >
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
                {t("featured.label")}
              </span>
              <h2 className="font-display text-[1.375rem] sm:text-3xl md:text-4xl font-bold">
                {t("featured.title")}
              </h2>
            </div>
            <Link
              to="/cursos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
            >
              {t("featured.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true, margin: "-30px" }}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-start"
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 bg-gradient-cosmic-subtle relative overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, hsl(265 55% 52%), transparent 70%)",
            y: featuresFloat,
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
              {t("features.label")}
            </span>
            <h2 className="font-display text-[1.375rem] sm:text-3xl md:text-4xl font-bold">
              {t("features.title")} <span className="text-gradient-gold">{t("features.titleHighlight")}</span>
            </h2>
          </motion.div>

          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-20px" }}
                className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm text-center active:scale-[0.98] transition-transform"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 mb-4 sm:mb-5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-[15px] sm:text-lg font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.65]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 sm:py-24 overflow-hidden">
        <motion.div
          className="container mx-auto px-6 sm:px-6 max-w-3xl text-center"
          style={{ scale: philosophyScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 mb-7 sm:mb-8">
              <Sparkles className="h-6 sm:h-6 w-6 sm:w-6 text-accent" />
            </div>
            <h2 className="font-display text-[1.5rem] sm:text-3xl md:text-4xl font-bold mb-7 sm:mb-8">
              {t("philosophy.title")} <span className="text-gradient-gold">Elevve</span>
            </h2>
            <p className="text-base sm:text-base text-muted-foreground leading-[1.8] mb-5 sm:mb-6">
              {t("philosophy.p1")}
            </p>
            <p className="text-base sm:text-base text-muted-foreground leading-[1.8]">
              {t("philosophy.p2")}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-6 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ y: ctaY }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-cosmic" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(40 80% 58% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(265 55% 70% / 0.3) 0%, transparent 50%)`
            }} />

            <div className="relative z-10">
              <h2 className="text-[1.5rem] sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-5 text-primary-foreground leading-tight">
                {t("cta.title1")}
                <br />
                {t("cta.title2")}
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/70 mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
                {t("cta.desc")}
              </p>
              <Button variant="gold" size="lg" className="w-full sm:w-auto sm:min-w-[220px] h-[52px] sm:h-11 text-base sm:text-sm active:scale-[0.97]" asChild>
                <Link to="/cadastro">
                  {t("cta.button")}
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
