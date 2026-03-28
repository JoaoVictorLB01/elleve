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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const Index = () => {
  const { t } = useLanguage();
  const featuredCourses = courses.filter((c) => c.featured);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const heroBgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "15%"]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.25], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const stats = [
    { icon: BookOpen, label: t("stats.courses"), value: "15+" },
    { icon: Users, label: t("stats.activeStudents"), value: "1.200+" },
    { icon: Star, label: t("stats.avgRating"), value: "4.9" },
    { icon: Award, label: t("stats.certificates"), value: "800+" },
  ];

  const features = [
    { icon: Zap, title: t("features.1.title"), desc: t("features.1.desc") },
    { icon: Eye, title: t("features.2.title"), desc: t("features.2.desc") },
    { icon: Heart, title: t("features.3.title"), desc: t("features.3.desc") },
  ];

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero — tighter, clearer */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroBg})`, y: heroBgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />

        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center pt-20 sm:pt-0"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <motion.div {...fadeUp}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3.5 py-1.5 rounded-full border border-border/60 bg-muted/30 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse-slow" />
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground tracking-wider uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <h1
              className="text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 tracking-tight"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-gradient-cosmic">{t("hero.title2")}</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground/90 max-w-md mx-auto mb-8 sm:mb-10 leading-[1.7] px-2">
              {t("hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full px-4 sm:px-0">
              <Button
                variant="cosmic"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] h-12 sm:h-11 text-[15px] sm:text-sm rounded-xl active:scale-[0.97] transition-transform"
                asChild
              >
                <Link to="/cursos">
                  {t("hero.explore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] h-11 sm:h-10 text-sm border-border/50 rounded-xl active:scale-[0.97] transition-transform"
                asChild
              >
                <Link to="/cadastro">{t("hero.createAccount")}</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-16 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <stat.icon className="h-4.5 w-4.5 mx-auto mb-2 text-primary" />
                <div className="text-xl sm:text-2xl font-bold mb-0.5 tracking-tight">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-10 sm:py-16 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-6 sm:mb-10"
          >
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-1.5 block">
                {t("featured.label")}
              </span>
              <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold">
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

          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true, margin: "-30px" }}
                className="min-w-[270px] sm:min-w-[290px] md:min-w-0 snap-start"
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gradient-cosmic-subtle relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-1.5 block">
              {t("features.label")}
            </span>
            <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold">
              {t("features.title")} <span className="text-gradient-gold">{t("features.titleHighlight")}</span>
            </h2>
          </motion.div>

          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="p-5 sm:p-7 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 mb-3.5 sm:mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-sm sm:text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 mb-6">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold mb-6">
              {t("philosophy.title")} <span className="text-gradient-gold">Elevve</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground/85 leading-[1.75] mb-4">
              {t("philosophy.p1")}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/85 leading-[1.75]">
              {t("philosophy.p2")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-14 text-center"
          >
            <div className="absolute inset-0 bg-gradient-cosmic" />
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(40 80% 58% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(265 55% 70% / 0.3) 0%, transparent 50%)`
            }} />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary-foreground leading-tight">
                {t("cta.title1")}
                <br />
                {t("cta.title2")}
              </h2>
              <p className="text-sm text-primary-foreground/65 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                {t("cta.desc")}
              </p>
              <Button variant="gold" size="lg" className="w-full sm:w-auto sm:min-w-[200px] h-12 sm:h-11 text-[15px] sm:text-sm active:scale-[0.97]" asChild>
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
