import { supabase } from "../lib/supabaseClient";
import { sanitizeImageUrl } from "../lib/content";

export const POST_IMAGES_BUCKET = "post-images";

function sanitizeBaseName(name) {
    const base = name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    return base.slice(0, 48) || "imagem";
}

/**
 * Envia imagem para o bucket público `post-images` (usuário autenticado).
 * @param {File} file
 * @param {string} subfolder ex.: "covers", "gallery", "about"
 */
export async function uploadPostImage(file, subfolder = "uploads") {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
        throw new Error("Faça login para enviar imagens.");
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "jpg";
    const safe = sanitizeBaseName(file.name);
    const path = `${session.user.id}/${subfolder}/${Date.now()}-${safe}.${ext}`;

    const { data, error } = await supabase.storage.from(POST_IMAGES_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
    });

    if (error) throw error;

    const { data: pub } = supabase.storage.from(POST_IMAGES_BUCKET).getPublicUrl(data.path);
    return pub.publicUrl;
}

function getStorageBaseUrl() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? `${url}/storage/v1/object/public/${POST_IMAGES_BUCKET}/` : "";
}

export function getPostImagePathFromUrl(url) {
    const safeUrl = sanitizeImageUrl(url);
    if (!safeUrl) return null;

    const storageBaseUrl = getStorageBaseUrl();
    if (!storageBaseUrl || !safeUrl.startsWith(storageBaseUrl)) return null;

    const path = safeUrl.slice(storageBaseUrl.length).split("?")[0].split("#")[0];
    return path ? decodeURIComponent(path) : null;
}

export async function deletePostImageByUrl(url) {
    const path = getPostImagePathFromUrl(url);
    if (!path) return { deleted: false, reason: "external-or-invalid-url" };

    const { error } = await supabase.storage.from(POST_IMAGES_BUCKET).remove([path]);
    if (error) {
        if (error.message?.toLowerCase().includes("not found")) {
            return { deleted: false, reason: "not-found" };
        }
        throw error;
    }

    return { deleted: true, path };
}
