import { supabase } from "../lib/supabaseClient";
import { normalizeImageUrlInput, sanitizeHtml } from "../lib/content";
import { deletePostImageByUrl } from "./storage";

export async function getAboutInfo() {
    const { data, error } = await supabase
        .from("about")
        .select("*")
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao buscar dados do sobre:", error);
        return null;
    }

    return data;
}

export async function upsertAbout(id, payload) {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        throw new Error("Usuario nao autenticado");
    }

    const sanitizedPayload = {
        ...payload,
        user_id: session.user.id,
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
            try {
                await deletePostImageByUrl(previous.image_url);
            } catch (storageError) {
                console.warn("Erro ao remover imagem antiga do sobre:", storageError);
            }
        }

        return data;
    }

    const { data, error } = await supabase
        .from("about")
        .insert(sanitizedPayload)
        .select()
        .single();

    if (error) {
        const alreadyExists =
            error.code === "23505" ||
            error.message?.toLowerCase().includes("duplicate key");

        if (!alreadyExists) throw error;

        const { data: existing, error: fetchError } = await supabase
            .from("about")
            .select("id")
            .limit(1)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!existing?.id) throw error;

        return upsertAbout(existing.id, sanitizedPayload);
    }

    return data;
}
