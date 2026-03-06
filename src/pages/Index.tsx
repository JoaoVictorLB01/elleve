import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const featuredCourses = courses.filter((c) => c.featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-accent animate-pulse-slow" />
              <span className="text-sm font-medium text-accent tracking-widest uppercase">
                Plataforma de Evolução
              </span>
              <Sparkles className="h-5 w-5 text-accent animate-pulse-slow" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient-gold">Eleve</span> sua{" "}
              <span className="text-gradient-cosmic">consciência</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Desperte o poder que existe dentro de você. Cursos transformadores sobre
              energia, cura e desenvolvimento pessoal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-cosmic glow-purple text-lg px-8" asChild>
                <Link to="/cursos">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-accent/30 hover:bg-accent/10" asChild>
                <Link to="/cadastro">Criar Conta Gratuita</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: BookOpen, label: "Cursos", value: "15+" },
              { icon: Users, label: "Alunos", value: "1.200+" },
              { icon: Star, label: "Avaliação", value: "4.9" },
              { icon: Award, label: "Certificados", value: "800+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-gradient-gold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Cursos em <span className="text-gradient-cosmic">Destaque</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Jornadas cuidadosamente criadas para sua transformação interior
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10" asChild>
              <Link to="/cursos">
                Ver todos os cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-gradient-cosmic-subtle">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-8 w-8 mx-auto mb-6 text-accent" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              A Filosofia <span className="text-gradient-gold">Elleve</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Acreditamos que cada ser humano carrega dentro de si uma luz única, uma energia
              pronta para ser despertada. A Elleve é mais do que uma plataforma de cursos — é
              um portal de transformação, onde conhecimento ancestral encontra ferramentas
              modernas de evolução pessoal.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossos instrutores são guias experientes que dedicaram suas vidas ao estudo da
              energia, consciência e cura. Cada curso é uma jornada cuidadosamente desenhada
              para elevar sua frequência e expandir sua percepção.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-cosmic rounded-2xl p-12 glow-purple"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Pronto para sua transformação?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Comece sua jornada de evolução pessoal hoje. Acesse cursos exclusivos e
              conecte-se com uma comunidade de buscadores.
            </p>
            <Button size="lg" className="bg-gradient-gold text-accent-foreground text-lg px-8 glow-gold" asChild>
              <Link to="/cadastro">
                Começar Agora
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
