import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

const DEFAULT_PUBLIC_POSTS_LIMIT = 10;
const DEFAULT_ADMIN_POSTS_LIMIT = 30;

const PUBLIC_POST_CARD_FIELDS =
    "id, title, slug, description, cover_image, cover_image_alt, published_at, created_at, updated_at";

const PUBLIC_POST_DETAIL_FIELDS =
    "id, title, slug, description, content, cover_image, cover_image_alt, published_at, created_at, updated_at";

const PUBLIC_POST_SLUG_FIELDS = "slug, published_at, created_at, updated_at";

const ADMIN_LIST_FIELDS =
    "id, title, slug, description, status, published_at, created_at, updated_at";

const ADMIN_DETAIL_FIELDS =
    "id, title, slug, description, content, cover_image, cover_image_alt, status, published_at, created_at, updated_at, user_id";

function applyRange(query, page = 1, limit = DEFAULT_PUBLIC_POSTS_LIMIT) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || DEFAULT_PUBLIC_POSTS_LIMIT);
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;
    return query.range(from, to);
}

export async function getPublishedPosts({ page = 1, limit = DEFAULT_PUBLIC_POSTS_LIMIT } = {}) {
    const query = supabase
        .from("posts")
        .select(PUBLIC_POST_CARD_FIELDS, { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    const { data, error, count } = await applyRange(query, page, limit);

    if (error) {
        console.error("Erro ao buscar posts publicados:", error);
        throw error;
    }

    return {
        posts: data || [],
        total: count || 0,
    };
}

export async function getPublishedPostSlugs({ limit = 200 } = {}) {
    const { data, error } = await supabase
        .from("posts")
        .select(PUBLIC_POST_SLUG_FIELDS)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(Math.max(1, Number(limit) || 200));

    if (error) {
        console.error("Erro ao buscar slugs publicados:", error);
        throw error;
    }

    return data || [];
}

export async function getPosts({ page = 1, limit = DEFAULT_ADMIN_POSTS_LIMIT } = {}) {
    const query = supabase
        .from("posts")
        .select(ADMIN_LIST_FIELDS)
        .order("created_at", { ascending: false });

    const { data, error } = await applyRange(query, page, limit);

    if (error) {
        console.error("Erro ao buscar posts:", error);
        throw error;
    }

    return data || [];
}

export async function getPublishedPostBySlug(slug) {
    const { data, error } = await supabase
        .from("posts")
        .select(PUBLIC_POST_DETAIL_FIELDS)
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao buscar post publicado:", error);
        throw error;
    }

    return data;
}

export async function getPostById(id) {
    const { data, error } = await supabase
        .from("posts")
        .select(ADMIN_DETAIL_FIELDS)
        .eq("id", id)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao buscar post:", error);
        throw error;
    }

    return data;
}

export async function createPost(payload) {
    const sanitizedPayload = {
        ...payload,
        description: typeof payload.description === "string" ? payload.description.trim() : "",
        content: sanitizeHtml(payload.content),
        cover_image: normalizeImageUrlInput(payload.cover_image),
        cover_image_alt: typeof payload.cover_image_alt === "string" ? payload.cover_image_alt.trim() : null,
    };

    const { data, error } = await supabase
        .from("posts")
        .insert(sanitizedPayload)
        .select(ADMIN_DETAIL_FIELDS)
        .single();

    if (error) throw error;
    return data;
}

export async function updatePost(id, payload) {
    const { data: previousPost, error: previousPostError } = await supabase
        .from("posts")
        .select("id, cover_image")
        .eq("id", id)
        .limit(1)
        .maybeSingle();

    if (previousPostError) throw previousPostError;

    const sanitizedPayload = {
        ...payload,
        description: typeof payload.description === "string" ? payload.description.trim() : "",
        content: sanitizeHtml(payload.content),
        cover_image: normalizeImageUrlInput(payload.cover_image),
        cover_image_alt: typeof payload.cover_image_alt === "string" ? payload.cover_image_alt.trim() : null,
    };

    const { data, error } = await supabase
        .from("posts")
        .update(sanitizedPayload)
        .eq("id", id)
        .select(ADMIN_DETAIL_FIELDS)
        .single();

    if (error) throw error;

    if (previousPost?.cover_image && previousPost.cover_image !== data?.cover_image) {
        await deletePostImageByUrl(previousPost.cover_image);
    }

    return data;
}

export async function deletePost(id) {
    const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("id, cover_image")
        .eq("id", id)
        .limit(1)
        .maybeSingle();

    if (fetchError) throw fetchError;

    if (post?.cover_image) {
        await deletePostImageByUrl(post.cover_image);
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
}
