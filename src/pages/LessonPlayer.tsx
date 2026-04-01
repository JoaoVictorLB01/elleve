import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Menu, X, FileText, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourses } from "@/hooks/useCourses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AuthGateModal from "@/components/AuthGateModal";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl, extractStoragePath } from "@/lib/storage";

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);

  // Auth gate: if not logged in, show modal
  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthGate(true);
    }
  }, [user, isLoading]);

  // Load completed lessons from DB
  useEffect(() => {
    if (!user || !courseId) return;
    supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .then(({ data }) => {
        if (data) setCompletedLessons(new Set(data.map((d) => d.lesson_id)));
      });
  }, [user, courseId]);

  const course = (courses || []).find((c) => c.id === courseId);
  const allLessons = course ? course.modules.flatMap((m) => m.lessons) : [];
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentIndex];
  const isEmbedUrl = currentLesson?.videoUrl?.includes("youtube.com") || currentLesson?.videoUrl?.includes("vimeo.com");

  // Resolve signed URL for direct video files from private bucket
  useEffect(() => {
    if (!currentLesson?.videoUrl || isEmbedUrl) {
      setResolvedVideoUrl(currentLesson?.videoUrl || null);
      return;
    }
    const storagePath = extractStoragePath(currentLesson.videoUrl, "course-media");
    if (storagePath && user) {
      getSignedFileUrl("course-media", storagePath).then((url) => {
        setResolvedVideoUrl(url || currentLesson.videoUrl || null);
      });
    } else {
      setResolvedVideoUrl(currentLesson.videoUrl);
    }
  }, [currentLesson?.videoUrl, isEmbedUrl, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">{t("lesson.notFound")}</div>;
  if (!currentLesson) return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">{t("lesson.lessonNotFound")}</div>;

  const progress = allLessons.length > 0 ? (completedLessons.size / allLessons.length) * 100 : 0;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const toggleComplete = async (id: string) => {
    if (!user || !courseId) return;
    const isDone = completedLessons.has(id);
    if (isDone) {
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setCompletedLessons((prev) => new Set(prev).add(id));
      await supabase.from("lesson_progress").upsert(
        { user_id: user.id, course_id: courseId, lesson_id: id, time_spent_seconds: 0 },
        { onConflict: "user_id,course_id,lesson_id" as any }
      );
      if (nextLesson) {
        setTimeout(() => navigate(`/curso/${courseId}/aula/${nextLesson.id}`), 800);
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-[85vw] max-w-[320px] border-r border-border bg-card/98 backdrop-blur-xl overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:w-[300px] lg:min-w-[300px]`}
      >
        <div className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-center justify-between lg:hidden mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("lesson.navigation")}</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Link to={`/curso/${course.id}`} className="text-xs text-primary hover:underline flex items-center gap-1 mb-3">
            <ChevronLeft className="h-3 w-3" />
            {t("lesson.backToCourse")}
          </Link>
          <h3 className="font-display font-semibold text-sm leading-snug">{course.title}</h3>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{completedLessons.size}/{allLessons.length} {t("lesson.lessonsCount")}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="py-2 sm:py-3">
          {course.modules.map((mod, mi) => (
            <div key={mod.id}>
              <div className="px-4 sm:px-5 py-2.5 sm:py-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  {t("lesson.module")} {mi + 1}
                </p>
                <p className="text-sm font-medium mt-0.5">{mod.title}</p>
              </div>
              {mod.lessons.map((lesson) => {
                const isActive = lesson.id === lessonId;
                const isDone = completedLessons.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    to={`/curso/${course.id}/aula/${lesson.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 text-sm transition-all ${
                      isActive
                        ? "bg-primary/10 text-foreground border-l-2 border-primary font-medium"
                        : "hover:bg-muted/30 text-muted-foreground border-l-2 border-transparent"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    ) : isActive ? (
                      <Play className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 opacity-40" />
                    )}
                    <span className="line-clamp-1 flex-1 text-[13px] sm:text-sm">{lesson.title}</span>
                    <span className="text-[10px] sm:text-[11px] shrink-0 opacity-60">{lesson.duration}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-16 z-20 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-background/90 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Toggle menu">
            <Menu className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-medium truncate block">{currentLesson.title}</span>
            <div className="flex items-center gap-2 mt-1 sm:hidden">
              <Progress value={progress} className="h-1 flex-1" />
              <span className="text-[10px] text-muted-foreground shrink-0">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            {prevLesson && (
              <Link to={`/curso/${course.id}/aula/${prevLesson.id}`} className="p-1.5 rounded-lg hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            {nextLesson && (
              <Link to={`/curso/${course.id}/aula/${nextLesson.id}`} className="p-1.5 rounded-lg hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video w-full bg-muted/50">
          {user ? (
            isEmbedUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : currentLesson.videoUrl ? (
              <video
                src={currentLesson.videoUrl}
                className="w-full h-full"
                controls
                controlsList="nodownload"
                title={currentLesson.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Vídeo não disponível</p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Faça login para assistir</p>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{currentLesson.title}</h1>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Button
              variant={completedLessons.has(currentLesson.id) ? "gold" : "outline"}
              size="sm"
              onClick={() => toggleComplete(currentLesson.id)}
              className="text-xs sm:text-sm"
              disabled={!user}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 sm:h-4 w-3.5 sm:w-4" />
              {completedLessons.has(currentLesson.id) ? t("lesson.completed") : t("lesson.markComplete")}
            </Button>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-xs sm:text-sm">{t("lesson.supplementary")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{currentLesson.description}</p>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center justify-between mt-10 pt-6 border-t border-border">
            {prevLesson ? (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/curso/${course.id}/aula/${prevLesson.id}`}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t("lesson.previous")}
                </Link>
              </Button>
            ) : <div />}
            {nextLesson ? (
              <Button variant="cosmic" size="sm" asChild>
                <Link to={`/curso/${course.id}/aula/${nextLesson.id}`}>
                  {t("lesson.next")} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="gold" size="sm">{t("lesson.courseCompleted")}</Button>
            )}
          </div>

          {/* Mobile nav */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 border-t border-border bg-background/95 backdrop-blur-xl flex items-center gap-2">
            {prevLesson ? (
              <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                <Link to={`/curso/${course.id}/aula/${prevLesson.id}`}>
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" /> {t("lesson.previous")}
                </Link>
              </Button>
            ) : <div className="flex-1" />}
            {nextLesson ? (
              <Button variant="cosmic" size="sm" className="flex-1 text-xs" asChild>
                <Link to={`/curso/${course.id}/aula/${nextLesson.id}`}>
                  {t("lesson.nextShort")} <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button variant="gold" size="sm" className="flex-1 text-xs">{t("lesson.courseCompletedShort")}</Button>
            )}
          </div>
          <div className="h-16 sm:hidden" />
        </div>
      </div>

      <AuthGateModal
        open={showAuthGate}
        onClose={() => {
          setShowAuthGate(false);
          if (!user) navigate(`/curso/${courseId}`);
        }}
        redirectTo={`/curso/${courseId}/aula/${lessonId}`}
      />
    </div>
  );
};

export default LessonPlayer;
