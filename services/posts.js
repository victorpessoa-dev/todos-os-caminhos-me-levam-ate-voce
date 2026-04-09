import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

const PUBLIC_POST_FIELDS =
    "id, title, slug, description, cover_image, cover_image_alt, status, published_at, created_at, updated_at";

const ADMIN_LIST_FIELDS =
    "id, title, slug, description, status, published_at, created_at, updated_at";

/** Lista só posts publicados (site público). RLS também restringe anônimos. */
export async function getPublishedPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select(PUBLIC_POST_FIELDS)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao buscar posts publicados:", error);
        throw error;
    }

    return data || [];
}

/** Lista todos os posts do usuário logado (inclui rascunhos). */
export async function getPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select(ADMIN_LIST_FIELDS)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao buscar posts:", error);
        throw error;
    }

    return data || [];
}

/**
 * Site público: só retorna post publicado (mesmo se o autor estiver logado).
 * Rascunhos existem só no painel (/admin/posts).
 */
export async function getPublishedPostBySlug(slug) {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
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
        .select("*")
        .eq("id", id)
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
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePost(id, payload) {
    const { data: previousPost, error: previousPostError } = await supabase
        .from("posts")
        .select("id, cover_image")
        .eq("id", id)
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
        .select()
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
        .maybeSingle();

    if (fetchError) throw fetchError;

    if (post?.cover_image) {
        await deletePostImageByUrl(post.cover_image);
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
}
