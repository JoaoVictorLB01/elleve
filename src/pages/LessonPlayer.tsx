import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Menu, X, FileText, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">Curso não encontrado</div>;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentIndex];

  if (!currentLesson) return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">Aula não encontrada</div>;

  const progress = allLessons.length > 0 ? (completedLessons.size / allLessons.length) * 100 : 0;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const toggleComplete = (id: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-80 border-r border-border bg-card overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:min-w-0 lg:border-0 lg:overflow-hidden"
        }`}
      >
        <div className="p-4 border-b border-border">
          <Link to={`/curso/${course.id}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao curso
          </Link>
          <h3 className="font-display font-semibold mt-2 text-sm">{course.title}</h3>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="py-2">
          {course.modules.map((mod, mi) => (
            <div key={mod.id}>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Módulo {mi + 1}
                </p>
                <p className="text-sm font-medium">{mod.title}</p>
              </div>
              {mod.lessons.map((lesson) => {
                const isActive = lesson.id === lessonId;
                const isDone = completedLessons.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    to={`/curso/${course.id}/aula/${lesson.id}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0" />
                    )}
                    <span className="line-clamp-1">{lesson.title}</span>
                    <span className="ml-auto text-xs shrink-0">{lesson.duration}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toggle */}
        <div className="sticky top-16 z-20 flex items-center gap-2 p-3 border-b border-border bg-background/80 backdrop-blur">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-muted rounded">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-medium truncate">{currentLesson.title}</span>
        </div>

        {/* Video */}
        <div className="aspect-video w-full bg-muted">
          <iframe
            src={currentLesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentLesson.title}
          />
        </div>

        {/* Lesson Info */}
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="font-display text-2xl font-bold mb-4">{currentLesson.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={completedLessons.has(currentLesson.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleComplete(currentLesson.id)}
              className={completedLessons.has(currentLesson.id) ? "bg-gradient-gold text-accent-foreground" : ""}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {completedLessons.has(currentLesson.id) ? "Concluída" : "Marcar como concluída"}
            </Button>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm m-0">Texto Complementar</h3>
              </div>
              <p className="text-sm text-muted-foreground">{currentLesson.description}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {prevLesson ? (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/curso/${course.id}/aula/${prevLesson.id}`}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Link>
              </Button>
            ) : <div />}
            {nextLesson ? (
              <Button size="sm" className="bg-gradient-cosmic" asChild>
                <Link to={`/curso/${course.id}/aula/${nextLesson.id}`}>
                  Próxima Aula
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="bg-gradient-gold text-accent-foreground">
                🎉 Curso Concluído!
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
