import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Link to={`/curso/${course.id}`} className="group block h-full">
      <div className="h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary-foreground">
              {course.category}
            </span>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-1">
            <Star className="h-3 w-3 text-accent fill-accent" />
            <span className="text-xs font-semibold">{course.rating}</span>
          </div>
        </div>
        <div className="p-5 pb-6">
          <h3 className="font-display text-lg font-semibold mb-2 leading-snug transition-colors group-hover:text-primary">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">por <span className="text-foreground/80 font-medium">{course.instructor}</span></span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.enrolledStudents}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CourseCard;
