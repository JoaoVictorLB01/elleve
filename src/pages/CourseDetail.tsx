import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/mockData";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Curso não encontrado.</p>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="bg-gradient-cosmic border-0 text-primary-foreground mb-4">
              {course.category}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{course.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-6">Conteúdo do Curso</h2>
            <div className="space-y-4">
              {course.modules.map((mod, mi) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.1 }}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <div className="p-5 border-b border-border bg-muted/30">
                    <h3 className="font-semibold">Módulo {mi + 1}: {mod.title}</h3>
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                  </div>
                  <div className="divide-y divide-border">
                    {mod.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {li + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 border border-border rounded-xl bg-card p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Duração: {course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{totalLessons} aulas • {course.modules.length} módulos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{course.enrolledStudents} alunos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span>{course.rating} avaliação</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Instrutor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>

              <Button className="w-full bg-gradient-cosmic glow-purple" size="lg" asChild>
                <Link to={`/curso/${course.id}/aula/${course.modules[0]?.lessons[0]?.id}`}>
                  Começar Curso
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
