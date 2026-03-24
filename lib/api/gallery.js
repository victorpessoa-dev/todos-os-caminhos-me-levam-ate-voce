import { supabase } from "../supabaseClient";

export async function getGallery() {
    const { data, error } = await supabase
        .from("gallery")
        .select("id, title, urlImage, createdAt, updatedAt")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Erro ao buscar galeria:", error);
        throw error;
    }

    return data || [];
}

export async function addGalleryItem(payload) {
    const { data, error } = await supabase
        .from("gallery")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteGalleryItem(id) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
}