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
      <div className="relative h-[35vh] sm:h-[45vh] min-h-[280px] sm:min-h-[360px] overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 pb-6 sm:pb-10">
          <div className="container mx-auto px-0 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-xs font-medium text-primary-foreground mb-3 sm:mb-4">
                {course.category}
              </span>
              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                {course.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
        {/* Mobile: CTA card first */}
        <div className="lg:hidden mb-6">
          <div className="border border-border rounded-xl bg-card p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: "Duração", value: course.duration },
                { icon: BookOpen, label: "Aulas", value: `${totalLessons}` },
                { icon: Users, label: "Alunos", value: String(course.enrolledStudents) },
                { icon: Star, label: "Nota", value: String(course.rating), accent: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <item.icon className={`h-3.5 w-3.5 ${item.accent ? "text-accent" : "text-primary"}`} />
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs border-t border-border pt-3">
              <span className="text-muted-foreground">Instrutor:</span>
              <span className="font-semibold">{course.instructor}</span>
            </div>
            <Button variant="cosmic" className="w-full" size="lg" asChild>
              <Link to={`/curso/${course.id}/aula/${course.modules[0]?.lessons[0]?.id}`}>
                Começar Curso
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Conteúdo do Curso</h2>
            <div className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              {course.modules.length} módulos • {totalLessons} aulas • {course.duration} de conteúdo
            </div>
            <div className="space-y-3 sm:space-y-4">
              {course.modules.map((mod, mi) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.1 }}
                  className="border border-border rounded-xl sm:rounded-2xl overflow-hidden bg-card"
                >
                  <div className="p-4 sm:p-5 bg-muted/20">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 text-[10px] sm:text-xs font-bold text-primary shrink-0">
                        {mi + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm truncate">{mod.title}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{mod.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <Play className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
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
