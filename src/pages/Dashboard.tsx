import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";
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
  const progress = useUserProgress(user?.id);

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

  // Build enrolled courses from real data
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
    <div className="min-h-screen pt-[80px] sm:pt-24 pb-16 sm:pb-16">
      <div className="container mx-auto px-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-[1.5rem] sm:text-3xl md:text-4xl font-bold mb-2">
            {t("dashboard.hello")}{firstName ? " " : "!"} {firstName && <><span className="text-gradient-gold">{firstName}</span> ✨</>}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t("dashboard.subtitle")}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-6 sm:mb-8">
          <div className="border border-border rounded-2xl bg-card p-4 flex flex-col items-center justify-center">
            <RadialProgress
              value={progress.activeCourses} max={Math.max(progress.activeCourses, 10)} label={t("dashboard.activeCourses")}
              icon={<BookOpen className="h-4 w-4" />} size={80} delay={0}
            />
          </div>
          <div className="border border-border rounded-2xl bg-card p-4 flex flex-col items-center justify-center">
            <RadialProgress
              value={progress.hoursStudied} max={Math.max(progress.hoursStudied, 50)} label={t("dashboard.hoursStudied")}
              icon={<Clock className="h-4 w-4" />} suffix="h" size={80} delay={0.1}
            />
          </div>
          <div className="border border-border rounded-2xl bg-card p-4 flex flex-col items-center justify-center">
            <RadialProgress
              value={progress.overallProgress} max={100} label={t("dashboard.progress")}
              icon={<TrendingUp className="h-4 w-4" />} suffix="%" size={80} delay={0.2}
            />
          </div>
          <div className="border border-border rounded-2xl bg-card p-4 flex flex-col items-center justify-center">
            <RadialProgress
              value={progress.certificates} max={Math.max(progress.certificates, 5)} label={t("dashboard.certificates")}
              icon={<Award className="h-4 w-4" />} size={80} delay={0.3}
            />
          </div>
        </div>


        {/* Level Badge */}
        <div className="mb-10 sm:mb-12">
          <LevelBadge xp={progress.xp} delay={0.35} />
        </div>

        {/* Continue Watching - only show if there are enrolled courses */}
        {enrolledCourses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold">{t("dashboard.continueWatching")}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
              {enrolledCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-border rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-colors active:scale-[0.99] sm:active:scale-100"
                >
                  <div className="sm:hidden">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 truncate">
                          {t("dashboard.next")} {course.lastLesson.title}
                        </p>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                            <span>{t("dashboard.progress")}</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <Button variant="cosmic" size="sm" className="w-full h-11 text-sm rounded-xl active:scale-[0.97]" asChild>
                        <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                          <Play className="mr-1.5 h-3.5 w-3.5" />
                          {t("dashboard.continueBtn")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex flex-row">
                    <div className="w-44 h-auto relative overflow-hidden shrink-0">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          {t("dashboard.next")} {course.lastLesson.title}
                        </p>
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
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

        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">{t("dashboard.recommended")}</h2>
          <Link to="/cursos" className="text-sm sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            {t("dashboard.viewAll")} <ArrowRight className="h-4 sm:h-3.5 w-4 sm:w-3.5" />
          </Link>
        </div>
        
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-4 sm:hidden -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-2xl bg-card overflow-hidden shrink-0 w-[70vw] max-w-[280px] snap-start active:scale-[0.98]"
            >
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
