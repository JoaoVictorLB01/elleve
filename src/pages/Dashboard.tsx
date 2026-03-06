import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";

const Dashboard = () => {
  // Mock enrolled courses with progress
  const enrolledCourses = courses.slice(0, 2).map((c, i) => ({
    ...c,
    progress: i === 0 ? 45 : 20,
    lastLesson: c.modules[0].lessons[i === 0 ? 2 : 0],
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Olá, <span className="text-gradient-gold">Aluno</span> ✨
          </h1>
          <p className="text-muted-foreground">Continue sua jornada de evolução</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "Cursos Ativos", value: "2" },
            { icon: Clock, label: "Horas Estudadas", value: "8h" },
            { icon: TrendingUp, label: "Progresso Médio", value: "32%" },
            { icon: Award, label: "Certificados", value: "0" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl bg-card p-4"
            >
              <stat.icon className="h-5 w-5 text-primary mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Continue Watching */}
        <h2 className="font-display text-xl font-bold mb-4">Continuar Assistindo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-40 h-32 sm:h-auto">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-semibold mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Próxima: {course.lastLesson.title}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progresso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <Button size="sm" className="bg-gradient-cosmic" asChild>
                    <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                      <Play className="mr-1 h-3 w-3" />
                      Continuar
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <h2 className="font-display text-xl font-bold mb-4">Recomendados para Você</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
