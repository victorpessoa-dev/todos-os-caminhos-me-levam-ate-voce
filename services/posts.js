import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, normalizeSlugInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

const DEFAULT_PUBLIC_POSTS_LIMIT = 10;
const DEFAULT_ADMIN_POSTS_LIMIT = 30;

const PUBLIC_POST_CARD_FIELDS =
    "id, title, slug, cover_image, published_at";

const PUBLIC_POST_DETAIL_FIELDS =
    "id, title, slug, description, content, cover_image, cover_image_alt, published_at, created_at, updated_at";

const ADMIN_LIST_FIELDS =
    "id, title, slug, description, status, published_at, created_at";

const ADMIN_DETAIL_FIELDS =
    "id, title, slug, description, content, cover_image, cover_image_alt, status, published_at, created_at, updated_at, user_id";

function applyRange(query, page = 1, limit = DEFAULT_PUBLIC_POSTS_LIMIT) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || DEFAULT_PUBLIC_POSTS_LIMIT);

    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    return query.range(from, to);
}

export async function getPublishedPosts({
    page = 1,
    limit = DEFAULT_PUBLIC_POSTS_LIMIT,
} = {}) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || DEFAULT_PUBLIC_POSTS_LIMIT);

    const query = supabase
        .from("posts")
        .select(PUBLIC_POST_CARD_FIELDS, { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false });

    const { data, error, count } = await applyRange(query, safePage, safeLimit);

    if (error) {
        console.error("Erro ao buscar posts:", error);
        throw error;
    }

    return {
        posts: data || [],
        total: count || 0,
        hasMore: safePage * safeLimit < (count || 0),
    };
}

export async function getPublishedPostBySlug(slug) {
    const normalizedSlug = normalizeSlugInput(slug);
    if (!normalizedSlug) return null;

    const { data, error } = await supabase
        .from("posts")
        .select(PUBLIC_POST_DETAIL_FIELDS)
        .eq("slug", normalizedSlug)
        .eq("status", "published")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao buscar post por slug:", error);
        throw error;
    }

    return data;
}

export async function getPublishedPostSlugs({ limit = 200 } = {}) {
    const { data, error } = await supabase
        .from("posts")
        .select("slug")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(Math.max(1, Number(limit) || 200));

    if (error) {
        console.error("Erro ao buscar slugs:", error);
        throw error;
    }

    return data || [];
}

export async function getPosts({
    page = 1,
    limit = DEFAULT_ADMIN_POSTS_LIMIT,
} = {}) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || DEFAULT_ADMIN_POSTS_LIMIT);

    const query = supabase
        .from("posts")
        .select(ADMIN_LIST_FIELDS, { count: "exact" })
        .order("created_at", { ascending: false });

    const { data, error, count } = await applyRange(query, safePage, safeLimit);

    if (error) {
        console.error("Erro ao buscar posts admin:", error);
        throw error;
    }

    return {
        posts: data || [],
        total: count || 0,
        hasMore: safePage * safeLimit < (count || 0),
    };
}

export async function getPostById(id) {
    if (!id) return null;

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
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        throw new Error("Usuario nao autenticado");
    }

    const sanitizedPayload = {
        ...payload,
        user_id: session.user.id,
        slug: normalizeSlugInput(payload.slug),
        description: payload.description?.trim() || "",
        content: sanitizeHtml(payload.content),
        cover_image: normalizeImageUrlInput(payload.cover_image),
        cover_image_alt: payload.cover_image_alt?.trim() || null,
    };

    if (!sanitizedPayload.slug) {
        throw new Error("Slug invalido");
    }

    const { data, error } = await supabase
        .from("posts")
        .insert(sanitizedPayload)
        .select(ADMIN_DETAIL_FIELDS)
        .single();

    if (error) {
        console.error("Erro ao criar post:", error);

        if (error.code === "23505") {
            throw new Error("SLUG_DUPLICADO");
        }

        throw error;
    }

    return data;
}

export async function updatePost(id, payload) {
    if (!id) throw new Error("ID invalido");

    const { data: previous, error: prevError } = await supabase
        .from("posts")
        .select("cover_image")
        .eq("id", id)
        .maybeSingle();

    if (prevError) {
        console.error("Erro ao buscar post anterior:", prevError);
        throw prevError;
    }

    const sanitizedPayload = {
        ...payload,
        slug: normalizeSlugInput(payload.slug),
        description: payload.description?.trim() || "",
        content: sanitizeHtml(payload.content),
        cover_image: normalizeImageUrlInput(payload.cover_image),
        cover_image_alt: payload.cover_image_alt?.trim() || null,
    };

    if (!sanitizedPayload.slug) {
        throw new Error("Slug invalido");
    }

    const { data, error } = await supabase
        .from("posts")
        .update(sanitizedPayload)
        .eq("id", id)
        .select(ADMIN_DETAIL_FIELDS)
        .single();

    if (error) {
        console.error("Erro ao atualizar post:", error);
        throw error;
    }

    if (previous?.cover_image && previous.cover_image !== data?.cover_image) {
        try {
            await deletePostImageByUrl(previous.cover_image);
        } catch (err) {
            console.warn("Erro ao deletar imagem antiga:", err);
        }
    }

    return data;
}

export async function deletePost(id) {
    if (!id) throw new Error("ID invalido");

    const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("id, cover_image")
        .eq("id", id)
        .maybeSingle();

    if (fetchError) {
        console.error("Erro ao buscar post:", fetchError);
        throw fetchError;
    }

    if (!post) {
        throw new Error("Post nao encontrado ou sem permissao");
    }

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao deletar post:", error);
        throw error;
    }

    if (post.cover_image) {
        try {
            await deletePostImageByUrl(post.cover_image);
        } catch (err) {
            console.warn("Erro ao deletar imagem do post:", err);
        }
    }

    return true;
}
