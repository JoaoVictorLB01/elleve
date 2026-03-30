
-- Create courses table
CREATE TABLE public.db_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  instructor text NOT NULL DEFAULT '',
  duration text DEFAULT '',
  image_url text DEFAULT '',
  category text NOT NULL DEFAULT 'geral',
  featured boolean NOT NULL DEFAULT false,
  enrolled_students integer NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.db_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.db_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.db_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.db_modules(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.db_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text DEFAULT '',
  description text DEFAULT '',
  duration text DEFAULT '',
  thumbnail_url text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.db_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_lessons ENABLE ROW LEVEL SECURITY;

-- Everyone can view courses, modules, lessons
CREATE POLICY "Courses are viewable by everyone" ON public.db_courses FOR SELECT TO public USING (true);
CREATE POLICY "Modules are viewable by everyone" ON public.db_modules FOR SELECT TO public USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON public.db_lessons FOR SELECT TO public USING (true);

-- Admins can manage courses
CREATE POLICY "Admins can insert courses" ON public.db_courses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update courses" ON public.db_courses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete courses" ON public.db_courses FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage modules
CREATE POLICY "Admins can insert modules" ON public.db_modules FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update modules" ON public.db_modules FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete modules" ON public.db_modules FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage lessons
CREATE POLICY "Admins can insert lessons" ON public.db_lessons FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update lessons" ON public.db_lessons FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete lessons" ON public.db_lessons FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for course images and videos
INSERT INTO storage.buckets (id, name, public) VALUES ('course-media', 'course-media', true);

-- Storage policies
CREATE POLICY "Course media is publicly accessible" ON storage.objects FOR SELECT TO public USING (bucket_id = 'course-media');
CREATE POLICY "Admins can upload course media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update course media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete course media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on courses
CREATE TRIGGER update_db_courses_updated_at BEFORE UPDATE ON public.db_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
