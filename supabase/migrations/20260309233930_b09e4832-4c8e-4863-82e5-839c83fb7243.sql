
-- Drop restrictive policies for book-covers
DROP POLICY IF EXISTS "Authenticated users can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update book covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete book covers" ON storage.objects;

-- Drop restrictive policies for book-pdfs
DROP POLICY IF EXISTS "Authenticated users can upload book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete book pdfs" ON storage.objects;

-- Allow anyone to upload to book-covers
CREATE POLICY "Anyone can upload book covers" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'book-covers');
CREATE POLICY "Anyone can update book covers" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'book-covers');
CREATE POLICY "Anyone can delete book covers" ON storage.objects FOR DELETE TO public USING (bucket_id = 'book-covers');

-- Allow anyone to upload to book-pdfs
CREATE POLICY "Anyone can upload book pdfs" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'book-pdfs');
CREATE POLICY "Anyone can update book pdfs" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'book-pdfs');
CREATE POLICY "Anyone can delete book pdfs" ON storage.objects FOR DELETE TO public USING (bucket_id = 'book-pdfs');
