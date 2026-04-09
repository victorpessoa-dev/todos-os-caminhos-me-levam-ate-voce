import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

export async function getAboutInfo() {
    const { data, error } = await supabase
        .from("about")
        .select("*")
        .limit(1)
        .maybeSingle();

    if (error) return null;

    return data;
}

export async function upsertAbout(id, payload) {
    const sanitizedPayload = {
        ...payload,
        description: sanitizeHtml(payload.description),
        image_url: normalizeImageUrlInput(payload.image_url),
    };

    if (id) {
        const { data: previous } = await supabase
            .from("about")
            .select("image_url")
            .eq("id", id)
            .maybeSingle();

        const { data, error } = await supabase
            .from("about")
            .update(sanitizedPayload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        if (previous?.image_url && previous.image_url !== data?.image_url) {
            await deletePostImageByUrl(previous.image_url);
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