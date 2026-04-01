import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { courses as mockCourses, Course, Module, Lesson } from "@/data/mockData";

export interface DbCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  image_url: string;
  category: string;
  featured: boolean;
  enrolled_students: number;
  rating: number;
  sort_order: number;
}

export interface DbModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface DbLesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  video_url: string;
  description: string;
  duration: string;
  thumbnail_url: string;
  sort_order: number;
}

function dbToAppCourse(
  course: DbCourse,
  modules: DbModule[],
  lessons: DbLesson[]
): Course {
  const courseModules = modules
    .filter((m) => m.course_id === course.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: course.id,
    title: course.title,
    description: course.description || "",
    instructor: course.instructor,
    duration: course.duration,
    image: course.image_url || "/placeholder.svg",
    category: course.category,
    featured: course.featured,
    enrolledStudents: course.enrolled_students,
    rating: course.rating,
    modules: courseModules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description || "",
      lessons: lessons
        .filter((l) => l.module_id === mod.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((l) => ({
          id: l.id,
          title: l.title,
          videoUrl: l.video_url,
          description: l.description || "",
          duration: l.duration,
          completed: false,
          attachments: [],
        })),
    })),
  };
}

async function fetchCoursesFromDb(): Promise<Course[]> {
  const [coursesRes, modulesRes, lessonsRes] = await Promise.all([
    supabase.from("db_courses").select("*").order("sort_order"),
    supabase.from("db_modules").select("*").order("sort_order"),
    supabase.from("db_lessons").select("*").order("sort_order"),
  ]);

  const dbCourses = (coursesRes.data || []) as unknown as DbCourse[];
  const dbModules = (modulesRes.data || []) as unknown as DbModule[];
  const dbLessons = (lessonsRes.data || []) as unknown as DbLesson[];

  if (dbCourses.length === 0) return mockCourses;

  return dbCourses
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => dbToAppCourse(c, dbModules, dbLessons));
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCoursesFromDb,
    staleTime: 30_000,
  });
}

export function useAllDbData() {
  return useQuery({
    queryKey: ["courses-raw"],
    queryFn: async () => {
      const [coursesRes, modulesRes, lessonsRes] = await Promise.all([
        supabase.from("db_courses").select("*").order("sort_order"),
        supabase.from("db_modules").select("*").order("sort_order"),
        supabase.from("db_lessons").select("*").order("sort_order"),
      ]);
      return {
        courses: (coursesRes.data || []) as unknown as DbCourse[],
        modules: (modulesRes.data || []) as unknown as DbModule[],
        lessons: (lessonsRes.data || []) as unknown as DbLesson[],
      };
    },
    staleTime: 10_000,
  });
}

export function useCoursesMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["courses"] });
    qc.invalidateQueries({ queryKey: ["courses-raw"] });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("course-media").upload(name, file);
    if (error) throw error;
    return supabase.storage.from("course-media").getPublicUrl(name).data.publicUrl;
  };

  const addCourse = useMutation({
    mutationFn: async (data: { title: string; description: string; instructor: string; duration: string; category: string; featured: boolean; imageFile?: File }) => {
      let image_url = "";
      if (data.imageFile) image_url = await uploadImage(data.imageFile);
      const { error } = await supabase.from("db_courses").insert({
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        duration: data.duration,
        category: data.category,
        featured: data.featured,
        image_url,
      } as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateCourse = useMutation({
    mutationFn: async (data: { id: string; title: string; description: string; instructor: string; duration: string; category: string; featured: boolean; imageFile?: File; image_url?: string }) => {
      let image_url = data.image_url || "";
      if (data.imageFile) image_url = await uploadImage(data.imageFile);
      const { error } = await supabase.from("db_courses").update({
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        duration: data.duration,
        category: data.category,
        featured: data.featured,
        image_url,
      } as any).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("db_courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const addModule = useMutation({
    mutationFn: async (data: { course_id: string; title: string; description: string; sort_order: number }) => {
      const { error } = await supabase.from("db_modules").insert(data as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateModule = useMutation({
    mutationFn: async (data: { id: string; title: string; description: string; sort_order: number }) => {
      const { id, ...rest } = data;
      const { error } = await supabase.from("db_modules").update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("db_modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const addLesson = useMutation({
    mutationFn: async (data: { module_id: string; course_id: string; title: string; video_url: string; description: string; duration: string; sort_order: number; videoFile?: File; thumbnailFile?: File }) => {
      let video_url = data.video_url || "";
      let thumbnail_url = "";
      if (data.videoFile) {
        const name = `videos/${Date.now()}-${data.videoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { data: upData, error: upErr } = await supabase.storage.from("course-media").upload(name, data.videoFile);
        if (upErr) throw upErr;
        video_url = upData.path;
      }
      if (data.thumbnailFile) thumbnail_url = await uploadImage(data.thumbnailFile);
      const { error } = await supabase.from("db_lessons").insert({
        module_id: data.module_id,
        course_id: data.course_id,
        title: data.title,
        video_url,
        description: data.description,
        duration: data.duration,
        sort_order: data.sort_order,
        thumbnail_url,
      } as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateLesson = useMutation({
    mutationFn: async (data: { id: string; title: string; video_url: string; description: string; duration: string; sort_order: number; videoFile?: File; thumbnailFile?: File; thumbnail_url?: string }) => {
      let video_url = data.video_url || "";
      let thumbnail_url = data.thumbnail_url || "";
      if (data.videoFile) {
        const name = `videos/${Date.now()}-${data.videoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { data: upData, error: upErr } = await supabase.storage.from("course-media").upload(name, data.videoFile);
        if (upErr) throw upErr;
        video_url = upData.path;
      }
      if (data.thumbnailFile) thumbnail_url = await uploadImage(data.thumbnailFile);
      const { error } = await supabase.from("db_lessons").update({
        title: data.title,
        video_url,
        description: data.description,
        duration: data.duration,
        sort_order: data.sort_order,
        thumbnail_url,
      } as any).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("db_lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    addCourse, updateCourse, deleteCourse,
    addModule, updateModule, deleteModule,
    addLesson, updateLesson, deleteLesson,
    uploadImage,
  };
}
