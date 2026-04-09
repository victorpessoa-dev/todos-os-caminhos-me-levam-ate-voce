import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

const DEFAULT_GALLERY_LIMIT = 20;

const GALLERY_FIELDS =
    "id, title, image_url, image_alt, created_at, updated_at";

function applyGalleryRange(query, page = 1, limit = DEFAULT_GALLERY_LIMIT) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || DEFAULT_GALLERY_LIMIT);

    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    return query.range(from, to);
}

export async function getGallery({
    page = 1,
    limit = DEFAULT_GALLERY_LIMIT,
} = {}) {
    const query = supabase
        .from("gallery")
        .select(GALLERY_FIELDS, { count: "exact" })
        .order("created_at", { ascending: false });

    const { data, error, count } = await applyGalleryRange(
        query,
        page,
        limit
    );

    if (error) {
        console.error("Erro ao buscar galeria:", error);
        throw error;
    }

    return {
        items: data || [],
        total: count || 0,
        page: Math.max(1, Number(page) || 1),
        limit: Math.max(1, Number(limit) || DEFAULT_GALLERY_LIMIT),
    };
}

export async function addGalleryItem(payload) {
    const sanitizedPayload = {
        ...payload,
        title: typeof payload.title === "string" ? payload.title.trim() : null,
        image_url: normalizeImageUrlInput(payload.image_url, { required: true }),
        image_alt:
            typeof payload.image_alt === "string"
                ? payload.image_alt.trim()
                : null,
    };

    const { data, error } = await supabase
        .from("gallery")
        .insert(sanitizedPayload)
        .select(GALLERY_FIELDS)
        .single();

    if (error) throw error;

    return data;
}

export async function deleteGalleryItem(id) {
    const { data: item, error: fetchError } = await supabase
        .from("gallery")
        .select("id, image_url")
        .eq("id", id)
        .limit(1)
        .maybeSingle();

    if (fetchError) throw fetchError;

    // remove imagem do storage
    if (item?.image_url) {
        await deletePostImageByUrl(item.image_url);
    }

    const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

    if (error) throw error;
}