import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

export async function getGallery() {
    const { data, error } = await supabase
        .from("gallery")
        .select("id, title, image_url, image_alt, created_at, updated_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao buscar galeria:", error);
        throw error;
    }

    return data || [];
}

export async function addGalleryItem(payload) {
    const sanitizedPayload = {
        ...payload,
        title: typeof payload.title === "string" ? payload.title.trim() : null,
        image_url: normalizeImageUrlInput(payload.image_url, { required: true }),
        image_alt: typeof payload.image_alt === "string" ? payload.image_alt.trim() : null,
    };

    const { data, error } = await supabase
        .from("gallery")
        .insert(sanitizedPayload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteGalleryItem(id) {
    const { data: item, error: fetchError } = await supabase
        .from("gallery")
        .select("id, image_url")
        .eq("id", id)
        .maybeSingle();

    if (fetchError) throw fetchError;

    if (item?.image_url) {
        await deletePostImageByUrl(item.image_url);
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
}
