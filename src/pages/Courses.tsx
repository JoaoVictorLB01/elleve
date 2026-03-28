import { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { courses, categories } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { t } = useLanguage();

  const filtered = activeCategory === "Todos"
    ? courses
    : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen pt-[80px] sm:pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
            {t("courses.label")}
          </span>
          <h1 className="font-display text-[1.5rem] sm:text-4xl md:text-5xl font-bold mb-3">
            {t("courses.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground/85 max-w-md mx-auto leading-relaxed">
            {t("courses.desc")}
          </p>
        </motion.div>

        <div className="flex gap-2.5 mb-8 sm:mb-10 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:justify-center -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 snap-start active:scale-[0.95] min-h-[44px] ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {t(`cat.${cat}`)}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;
