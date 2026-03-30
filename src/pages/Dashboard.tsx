import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourses } from "@/hooks/useCourses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RadialProgress from "@/components/RadialProgress";
import LevelBadge from "@/components/LevelBadge";
import { useUserProgress } from "@/hooks/useUserProgress";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>("");
  const { data: courses = [] } = useCourses();
  const progress = useUserProgress(user?.id, courses);

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      const name = data?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "";
      const first = name.split(" ")[0];
      setFirstName(first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "");
    };
    fetchName();
  }, [user]);

  const enrolledCourses = progress.enrolledCourseDetails
    .filter(cd => cd.progress < 100)
    .map(cd => {
      const course = courses.find(c => c.id === cd.courseId);
      if (!course) return null;
      const lastLesson = cd.lastLessonId
        ? course.modules.flatMap(m => m.lessons).find(l => l.id === cd.lastLessonId)
        : course.modules[0]?.lessons[0];
      return {
        ...course,
        progress: cd.progress,
        lastLesson: lastLesson || course.modules[0]?.lessons[0],
      };
    })
    .filter(Boolean) as Array<(typeof courses)[0] & { progress: number; lastLesson: { id: string; title: string } }>;

  return (
    <div className="min-h-screen pt-[80px] sm:pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-[1.375rem] sm:text-3xl md:text-4xl font-bold mb-1.5">
            {t("dashboard.hello")}{firstName ? " " : "!"} {firstName && <><span className="text-gradient-gold">{firstName}</span> ✨</>}
          </h1>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">{t("dashboard.subtitle")}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-5 sm:mb-7">
          {[
            { value: progress.activeCourses, max: Math.max(progress.activeCourses, 10), label: t("dashboard.activeCourses"), icon: <BookOpen className="h-4 w-4" />, delay: 0 },
            { value: progress.hoursStudied, max: Math.max(progress.hoursStudied, 50), label: t("dashboard.hoursStudied"), icon: <Clock className="h-4 w-4" />, suffix: "h", delay: 0.08 },
            { value: progress.overallProgress, max: 100, label: t("dashboard.progress"), icon: <TrendingUp className="h-4 w-4" />, suffix: "%", delay: 0.16 },
            { value: progress.certificates, max: Math.max(progress.certificates, 5), label: t("dashboard.certificates"), icon: <Award className="h-4 w-4" />, delay: 0.24 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.4 }}
              className="border border-border/50 rounded-2xl bg-card/60 p-3.5 flex flex-col items-center justify-center"
            >
              <RadialProgress
                value={stat.value} max={stat.max} label={stat.label}
                icon={stat.icon} suffix={stat.suffix} size={76} delay={stat.delay}
              />
            </motion.div>
          ))}
        </div>

        {/* Level Badge */}
        <div className="mb-8 sm:mb-10">
          <LevelBadge xp={progress.xp} delay={0.3} />
        </div>

        {/* Continue Watching */}
        {enrolledCourses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold">{t("dashboard.continueWatching")}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 mb-8 sm:mb-12">
              {enrolledCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border/50 rounded-2xl bg-card/60 overflow-hidden hover:border-primary/30 transition-colors active:scale-[0.99]"
                >
                  <div className="sm:hidden">
                    <div className="flex gap-3.5 p-3.5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground/70 mb-2.5 truncate">
                          {t("dashboard.next")} {course.lastLesson.title}
                        </p>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground/70 mb-1">
                            <span>{t("dashboard.progress")}</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    <div className="px-3.5 pb-3.5">
                      <Button variant="cosmic" size="sm" className="w-full h-10 text-sm rounded-xl active:scale-[0.97]" asChild>
                        <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                          <Play className="mr-1.5 h-3.5 w-3.5" />
                          {t("dashboard.continueBtn")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex flex-row">
                    <div className="w-40 h-auto relative overflow-hidden shrink-0">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                        <p className="text-xs text-muted-foreground/70 mb-3">
                          {t("dashboard.next")} {course.lastLesson.title}
                        </p>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground/70 mb-1">
                            <span>{t("dashboard.progress")}</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </div>
                      <Button variant="cosmic" size="sm" className="self-start" asChild>
                        <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                          <Play className="mr-1.5 h-3 w-3" />
                          {t("dashboard.continueShort")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold">{t("dashboard.recommended")}</h2>
          <Link to="/cursos" className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
            {t("dashboard.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border/50 rounded-2xl bg-card/60 overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3.5">
                <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground/70">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 sm:hidden -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border/50 rounded-2xl bg-card/60 overflow-hidden shrink-0 w-[68vw] max-w-[270px] snap-start active:scale-[0.98]"
            >
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3.5">
                <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                <p className="text-xs text-muted-foreground/70 truncate">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
