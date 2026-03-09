
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles RLS: admins can manage, users can read own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update books RLS: only admins can write
DROP POLICY IF EXISTS "Authenticated users can delete books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can update books" ON public.books;

CREATE POLICY "Admins can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Update storage RLS: only admins can upload
DROP POLICY IF EXISTS "Anyone can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update book pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete book pdfs" ON storage.objects;

CREATE POLICY "Admins can upload book covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update book covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete book covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload book pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update book pdfs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete book pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-pdfs' AND public.has_role(auth.uid(), 'admin'));
