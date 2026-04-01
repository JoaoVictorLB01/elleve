-- Make course-media public for reading (thumbnails need to be visible on public course pages)
-- Video security is enforced at DB level (db_lessons restricted to authenticated users)
UPDATE storage.buckets SET public = true WHERE id = 'course-media';

-- Also keep book-covers public (covers aren't sensitive content)
UPDATE storage.buckets SET public = true WHERE id = 'book-covers';