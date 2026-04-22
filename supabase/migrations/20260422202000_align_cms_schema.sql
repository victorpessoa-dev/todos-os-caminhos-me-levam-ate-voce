CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_post_publication_state()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status = 'draft' THEN
        NEW.published_at = NULL;
    ELSIF NEW.status = 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = now();
    END IF;

    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text NOT NULL DEFAULT '',
    content text NOT NULL DEFAULT '',
    cover_image text,
    cover_image_alt text,
    status text NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    image_url text NOT NULL,
    image_alt text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.about (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    description text,
    image_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_about_singleton
ON public.about ((true));

CREATE INDEX IF NOT EXISTS idx_posts_user_id
ON public.posts(user_id);

CREATE INDEX IF NOT EXISTS idx_posts_created_at
ON public.posts(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug_lower
ON public.posts (lower(slug));

CREATE INDEX IF NOT EXISTS idx_posts_published_fast
ON public.posts(published_at DESC)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_gallery_user_id
ON public.gallery(user_id);

CREATE INDEX IF NOT EXISTS idx_gallery_created_at
ON public.gallery(created_at DESC);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts FORCE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery FORCE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about FORCE ROW LEVEL SECURITY;

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_about_updated_at
BEFORE UPDATE ON public.about
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_posts_sync_publication_state
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.sync_post_publication_state();

CREATE POLICY "Admins can read own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Public can read published posts"
ON public.posts
FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    OR public.is_admin()
);

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

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

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
);

CREATE POLICY "Admins can update post images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'post-images'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'post-images'
    AND public.is_admin()
);

CREATE POLICY "Admins can delete post images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'post-images'
    AND public.is_admin()
);
