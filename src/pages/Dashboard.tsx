import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";

const Dashboard = () => {
  const enrolledCourses = courses.slice(0, 2).map((c, i) => ({
    ...c,
    progress: i === 0 ? 45 : 20,
    lastLesson: c.modules[0].lessons[i === 0 ? 2 : 0],
  }));

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            Olá, <span className="text-gradient-gold">Aluno</span> ✨
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Continue sua jornada de evolução</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8 sm:mb-12">
          {[
            { icon: BookOpen, label: "Cursos Ativos", value: "2", color: "text-primary" },
            { icon: Clock, label: "Horas Estudadas", value: "8h", color: "text-primary" },
            { icon: TrendingUp, label: "Progresso", value: "32%", color: "text-primary" },
            { icon: Award, label: "Certificados", value: "0", color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border border-border rounded-xl sm:rounded-2xl bg-card p-3.5 sm:p-5"
            >
              <stat.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${stat.color} mb-2 sm:mb-3`} />
              <div className="text-xl sm:text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Continue Watching */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold">Continuar Assistindo</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl sm:rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Mobile: stacked layout */}
              <div className="relative h-32 sm:hidden overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-sm">{course.title}</h3>
                </div>
              </div>
              
              {/* Desktop: horizontal layout */}
              <div className="hidden sm:flex flex-row">
                <div className="w-44 h-auto relative overflow-hidden shrink-0">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Próxima: {course.lastLesson.title}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progresso</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  </div>
                  <Button variant="cosmic" size="sm" className="self-start" asChild>
                    <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                      <Play className="mr-1.5 h-3 w-3" />
                      Continuar
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Mobile: content below image */}
              <div className="p-3.5 sm:hidden">
                <p className="text-[11px] text-muted-foreground mb-3">
                  Próxima: {course.lastLesson.title}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
                <Button variant="cosmic" size="sm" className="w-full text-xs" asChild>
                  <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                    <Play className="mr-1.5 h-3 w-3" />
                    Continuar
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold">Recomendados</h2>
          <Link to="/cursos" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Ver todos <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
          </Link>
        </div>
        
        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-4 sm:hidden -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-xl bg-card overflow-hidden shrink-0 w-[70vw] max-w-[280px] snap-start"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-xs mb-0.5">{course.title}</h3>
                <p className="text-[10px] text-muted-foreground">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
