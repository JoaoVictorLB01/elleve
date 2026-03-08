import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Play, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const enrolledCourses = courses.slice(0, 2).map((c, i) => ({
    ...c,
    progress: i === 0 ? 45 : 20,
    lastLesson: c.modules[0].lessons[i === 0 ? 2 : 0],
  }));

  return (
    <div className="min-h-screen pt-[76px] sm:pt-24 pb-12 sm:pb-16">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="text-[1.35rem] sm:text-3xl md:text-4xl font-bold mb-1.5">
            {t("dashboard.hello")} <span className="text-gradient-gold">{t("dashboard.student")}</span> ✨
          </h1>
          <p className="text-[13px] sm:text-base text-muted-foreground leading-relaxed">{t("dashboard.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 mb-6 sm:mb-12">
          {[
            { icon: BookOpen, label: t("dashboard.activeCourses"), value: "2", color: "text-primary" },
            { icon: Clock, label: t("dashboard.hoursStudied"), value: "8h", color: "text-primary" },
            { icon: TrendingUp, label: t("dashboard.progress"), value: "32%", color: "text-primary" },
            { icon: Award, label: t("dashboard.certificates"), value: "0", color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border border-border rounded-xl sm:rounded-2xl bg-card p-3 sm:p-5"
            >
              <stat.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${stat.color} mb-1.5 sm:mb-3`} />
              <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h2 className="text-base sm:text-xl font-bold">{t("dashboard.continueWatching")}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-14">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl sm:rounded-2xl bg-card overflow-hidden hover:border-primary/30 transition-colors active:scale-[0.99] sm:active:scale-100"
            >
              <div className="sm:hidden">
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[13px] mb-0.5 truncate">{course.title}</h3>
                    <p className="text-[11px] text-muted-foreground mb-2 truncate">
                      {t("dashboard.next")} {course.lastLesson.title}
                    </p>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{t("dashboard.progress")}</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <Button variant="cosmic" size="sm" className="w-full h-9 text-xs" asChild>
                    <Link to={`/curso/${course.id}/aula/${course.lastLesson.id}`}>
                      <Play className="mr-1.5 h-3 w-3" />
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

        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h2 className="text-base sm:text-xl font-bold">{t("dashboard.recommended")}</h2>
          <Link to="/cursos" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            {t("dashboard.viewAll")} <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
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

        <div className="flex gap-2.5 overflow-x-auto pb-4 sm:hidden -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="border border-border rounded-xl bg-card overflow-hidden shrink-0 w-[65vw] max-w-[260px] snap-start active:scale-[0.98]"
            >
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-[13px] mb-0.5 truncate">{course.title}</h3>
                <p className="text-[11px] text-muted-foreground truncate">{course.instructor} • {course.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
