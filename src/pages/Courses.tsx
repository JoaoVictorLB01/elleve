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
    <div className="min-h-screen pt-[76px] sm:pt-24 pb-16">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-14"
        >
          <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-2 sm:mb-3 block">
            {t("courses.label")}
          </span>
          <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t("courses.title")}
          </h1>
          <p className="text-[13px] sm:text-base text-muted-foreground max-w-md mx-auto px-2 leading-[1.6]">
            {t("courses.desc")}
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-[13px] sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {t(`cat.${cat}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
