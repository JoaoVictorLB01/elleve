import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { courses as mockCourses, Course } from "@/data/mockData";

interface ProgressStats {
  activeCourses: number;
  hoursStudied: number;
  overallProgress: number;
  certificates: number;
  xp: number;
  enrolledCourseDetails: {
    courseId: string;
    completedLessons: number;
    totalLessons: number;
    progress: number;
    lastLessonId: string | null;
  }[];
  loading: boolean;
}

export function useUserProgress(userId: string | undefined, coursesList?: Course[]): ProgressStats {
  const [stats, setStats] = useState<ProgressStats>({
    activeCourses: 0, hoursStudied: 0, overallProgress: 0,
    certificates: 0, xp: 0, enrolledCourseDetails: [], loading: true,
  });

  const courses = coursesList || mockCourses;

  useEffect(() => {
    if (!userId) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchProgress = async () => {
      const [enrollmentsRes, progressRes] = await Promise.all([
        supabase.from("enrollments").select("course_id, enrolled_at").eq("user_id", userId),
        supabase.from("lesson_progress").select("course_id, lesson_id, time_spent_seconds").eq("user_id", userId),
      ]);

      const enrollments = enrollmentsRes.data || [];
      const lessonProgress = progressRes.data || [];

      const totalSeconds = lessonProgress.reduce((sum, lp) => sum + (lp.time_spent_seconds || 0), 0);
      const hoursStudied = Math.round((totalSeconds / 3600) * 10) / 10;

      const courseDetails = enrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.course_id);
        const totalLessons = course ? course.modules.reduce((sum, m) => sum + m.lessons.length, 0) : 0;
        const completedInCourse = lessonProgress.filter(lp => lp.course_id === enrollment.course_id);
        const completedLessons = completedInCourse.length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const completedIds = new Set(completedInCourse.map(lp => lp.lesson_id));
        let lastLessonId: string | null = null;
        if (course) {
          for (const mod of course.modules) {
            for (const lesson of mod.lessons) {
              if (!completedIds.has(lesson.id)) { lastLessonId = lesson.id; break; }
            }
            if (lastLessonId) break;
          }
          if (!lastLessonId && course.modules.length > 0) {
            const lastMod = course.modules[course.modules.length - 1];
            lastLessonId = lastMod.lessons[lastMod.lessons.length - 1]?.id || null;
          }
        }

        return { courseId: enrollment.course_id, completedLessons, totalLessons, progress, lastLessonId };
      });

      const activeCourses = courseDetails.filter(c => c.progress < 100).length;
      const certificates = courseDetails.filter(c => c.progress === 100).length;
      const overallProgress = courseDetails.length > 0
        ? Math.round(courseDetails.reduce((sum, c) => sum + c.progress, 0) / courseDetails.length) : 0;
      const xp = lessonProgress.length * 10 + certificates * 50;

      setStats({ activeCourses, hoursStudied, overallProgress, certificates, xp, enrolledCourseDetails: courseDetails, loading: false });
    };

    fetchProgress();
  }, [userId, courses]);

  return stats;
}
