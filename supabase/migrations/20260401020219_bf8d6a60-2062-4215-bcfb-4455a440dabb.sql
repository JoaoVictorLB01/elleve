
CREATE TABLE public.elevve_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.elevve_videos ENABLE ROW LEVEL SECURITY;

-- Everyone can view videos
CREATE POLICY "Elevve videos viewable by authenticated"
  ON public.elevve_videos FOR SELECT
  TO authenticated USING (true);

-- Block anon from viewing
CREATE POLICY "Anon cannot view elevve videos"
  ON public.elevve_videos FOR SELECT
  TO anon USING (false);

-- Admin CRUD
CREATE POLICY "Admins can insert elevve videos"
  ON public.elevve_videos FOR INSERT
  TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update elevve videos"
  ON public.elevve_videos FOR UPDATE
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete elevve videos"
  ON public.elevve_videos FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'));
