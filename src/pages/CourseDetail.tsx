import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen pt-16 pb-16">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[360px] overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary-foreground mb-4">
                {course.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
                {course.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-6">Conteúdo do Curso</h2>
            <div className="text-sm text-muted-foreground mb-6">
              {course.modules.length} módulos • {totalLessons} aulas • {course.duration} de conteúdo
            </div>
            <div className="space-y-4">
              {course.modules.map((mod, mi) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.1 }}
                  className="border border-border rounded-2xl overflow-hidden bg-card"
                >
                  <div className="p-5 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {mi + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {mod.lessons.map((lesson, li) => (
                      <div
                        key={lesson.id}
                        className="px-5 py-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                            <Play className="h-3 w-3 text-muted-foreground" />
                          </div>
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
            <div className="sticky top-24 border border-border rounded-2xl bg-card overflow-hidden">
              <div className="p-6 space-y-5">
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: "Duração", value: course.duration },
                    { icon: BookOpen, label: "Aulas", value: `${totalLessons} aulas` },
                    { icon: Users, label: "Alunos", value: String(course.enrolledStudents) },
                    { icon: Star, label: "Avaliação", value: String(course.rating), accent: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className={`h-4 w-4 ${item.accent ? "text-accent" : "text-primary"}`} />
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-5">
                  <p className="text-xs text-muted-foreground mb-1">Instrutor</p>
                  <p className="font-semibold text-sm">{course.instructor}</p>
                </div>

                <Button variant="cosmic" className="w-full" size="lg" asChild>
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
    </div>
  );
};

export default CourseDetail;
