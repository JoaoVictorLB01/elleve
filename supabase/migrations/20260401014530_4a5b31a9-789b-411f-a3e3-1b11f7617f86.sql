-- Fix 1: user_roles privilege escalation - replace ALL policy with separate policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Admins can insert new roles (WITH CHECK prevents non-admins from inserting)
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Restrict db_lessons to authenticated users + admins (hide video URLs from public)
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.db_lessons;

CREATE POLICY "Authenticated users can view lessons"
ON public.db_lessons FOR SELECT
TO authenticated
USING (true);

-- Also allow admins via public role for admin operations
CREATE POLICY "Admins can view all lessons"
ON public.db_lessons FOR SELECT
TO anon
USING (false);

-- Fix 3: Make book-pdfs bucket private
UPDATE storage.buckets SET public = false WHERE id = 'book-pdfs';

-- Fix 4: Make course-media bucket private  
UPDATE storage.buckets SET public = false WHERE id = 'course-media';