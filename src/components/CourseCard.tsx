import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Link to={`/curso/${course.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:glow-purple">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-gradient-cosmic border-0 text-primary-foreground">
            {course.category}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-gradient-cosmic transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course.enrolledStudents}
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-3 w-3 fill-current" />
              {course.rating}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">por {course.instructor}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CourseCard;
