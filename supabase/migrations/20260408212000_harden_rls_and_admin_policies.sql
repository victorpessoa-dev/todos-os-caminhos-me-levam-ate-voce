CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "Admins can read own admin record" ON public.admin_users;

DROP POLICY IF EXISTS "Public can read published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;

DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery;

DROP POLICY IF EXISTS "Public can read about" ON public.about;
DROP POLICY IF EXISTS "Admins can insert about" ON public.about;
DROP POLICY IF EXISTS "Admins can update about" ON public.about;
DROP POLICY IF EXISTS "Admins can delete about" ON public.about;

DROP POLICY IF EXISTS "Public can view post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update own post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete own post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts FORCE ROW LEVEL SECURITY;

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery FORCE ROW LEVEL SECURITY;

ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about FORCE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Public can read published posts"
ON public.posts
FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public can read gallery"
ON public.gallery
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert gallery"
ON public.gallery
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery"
ON public.gallery
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete gallery"
ON public.gallery
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public can read about"
ON public.about
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert about"
ON public.about
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update about"
ON public.about
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete about"
ON public.about
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public can view post images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'post-images');

CREATE POLICY "Admins can upload post images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'post-images'
    AND public.is_admin()
    AND owner = auth.uid()
);

CREATE POLICY "Admins can update own post images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'post-images'
    AND public.is_admin()
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'post-images'
    AND public.is_admin()
    AND owner = auth.uid()
);

CREATE POLICY "Admins can delete own post images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'post-images'
    AND public.is_admin()
    AND owner = auth.uid()
);

COMMENT ON TABLE public.admin_users IS 'Lista de usuários com acesso administrativo ao CMS.';
