import { supabase } from "../supabaseClient";

export async function getAboutInfo() {
    const { data, error } = await supabase
        .from("about")
        .select("id, description, urlImage, createdAt, updatedAt")
        .order("createdAt", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error("Erro ao buscar about:", error);
        return null;
    }

    return data;
}

export async function upsertAbout(id, payload) {
    if (id) {
        const { data, error } = await supabase
            .from("about")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from("about")
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}