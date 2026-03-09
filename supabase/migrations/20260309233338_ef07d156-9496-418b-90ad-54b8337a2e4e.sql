
-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);

-- Create storage bucket for book PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('book-pdfs', 'book-pdfs', true);

-- Allow public read access to book covers
CREATE POLICY "Public read access for book covers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'book-covers');

-- Allow authenticated users to upload book covers
CREATE POLICY "Authenticated users can upload book covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-covers');

-- Allow authenticated users to update book covers
CREATE POLICY "Authenticated users can update book covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-covers');

-- Allow authenticated users to delete book covers
CREATE POLICY "Authenticated users can delete book covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-covers');

-- Allow public read access to book PDFs
CREATE POLICY "Public read access for book pdfs" ON storage.objects FOR SELECT TO public USING (bucket_id = 'book-pdfs');

-- Allow authenticated users to upload book PDFs
CREATE POLICY "Authenticated users can upload book pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-pdfs');

-- Allow authenticated users to update book PDFs
CREATE POLICY "Authenticated users can update book pdfs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-pdfs');

-- Allow authenticated users to delete book PDFs
CREATE POLICY "Authenticated users can delete book pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-pdfs');
