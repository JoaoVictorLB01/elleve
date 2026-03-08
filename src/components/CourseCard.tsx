import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link to={`/curso/${course.id}`} className="group block h-full">
        <div className="h-full overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 sm:hover:-translate-y-1 active:scale-[0.98] sm:active:scale-100">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-primary-foreground">
                {t(`cat.${course.category}`)}
              </span>
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-accent fill-accent" />
              <span className="text-[10px] sm:text-xs font-semibold">{course.rating}</span>
            </div>
          </div>
          <div className="p-4 pb-5 sm:p-5 sm:pb-6">
            <h3 className="text-[15px] sm:text-lg font-semibold mb-1.5 sm:mb-2 leading-snug transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <p className="text-[13px] sm:text-sm text-muted-foreground line-clamp-2 mb-4 sm:mb-5 leading-[1.6]">
              {course.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                {t("course.by")} <span className="text-foreground/80 font-medium">{course.instructor}</span>
              </span>
              <div className="flex items-center gap-3 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {course.enrolledStudents}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
