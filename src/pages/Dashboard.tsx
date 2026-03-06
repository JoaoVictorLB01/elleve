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
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Olá, <span className="text-gradient-gold">Aluno</span> ✨
          </h1>
          <p className="text-muted-foreground">Continue sua jornada de evolução</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: "Cursos Ativos", value: "2", color: "text-primary" },
            { icon: Clock, label: "Horas Estudadas", value: "8h", color: "text-primary" },
            { icon: TrendingUp, label: "Progresso Médio", value: "32%", color: "text-primary" },
            { icon: Award, label: "Certificados", value: "0", color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border border-border rounded-2xl bg-card p-5"
            >
              <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Continue Watching */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Continuar Assistindo</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-44 h-36 sm:h-auto relative overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/30 flex items-center justify-center sm:opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
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
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Recomendados para Você</h2>
          <Link to="/cursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard;
