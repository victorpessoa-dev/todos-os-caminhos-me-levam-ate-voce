import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

export async function getAboutInfo() {
    const { data, error } = await supabase
        .from("about")
        .select("id, description, image_url, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao buscar about:", error);
        return null;
    }

    return data;
}

export async function upsertAbout(id, payload) {
    const sanitizedPayload = {
        ...payload,
        description: sanitizeHtml(payload.description),
        image_url: normalizeImageUrlInput(payload.image_url),
    };

    if (id) {
        const { data: previousAbout, error: previousAboutError } = await supabase
            .from("about")
            .select("id, image_url")
            .eq("id", id)
            .maybeSingle();

        if (previousAboutError) throw previousAboutError;

        const { data, error } = await supabase
            .from("about")
            .update(sanitizedPayload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;

        if (previousAbout?.image_url && previousAbout.image_url !== data?.image_url) {
            await deletePostImageByUrl(previousAbout.image_url);
        }

        return data;
    }
    const { data, error } = await supabase
        .from("about")
        .insert(sanitizedPayload)
        .select()
        .single();
    if (error) throw error;
    return data;
}
