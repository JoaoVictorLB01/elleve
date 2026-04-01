-- Drop existing and recreate for book-pdfs
DROP POLICY IF EXISTS "Authenticated users can read book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for book pdfs" ON storage.objects;

CREATE POLICY "Authenticated users can read book pdfs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'book-pdfs');

CREATE POLICY "Admins can upload book pdfs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update book pdfs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Drop existing and recreate for course-media
DROP POLICY IF EXISTS "Authenticated users can read course media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course media" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for course media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read course media" ON storage.objects;

CREATE POLICY "Authenticated users can read course media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'course-media');

CREATE POLICY "Admins can upload course media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'course-media' AND public.has_role(auth.uid(), 'admin'::app_role));