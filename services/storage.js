import { supabase } from "../lib/supabaseClient";
import { sanitizeImageUrl } from "../lib/content";

export const POST_IMAGES_BUCKET = "post-images";

function sanitizeBaseName(name) {
    const base = name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    return base.slice(0, 48) || "imagem";
}

export async function uploadPostImage(file, subfolder = "uploads") {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        throw new Error("Faça login para enviar imagens.");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safe = sanitizeBaseName(file.name);

    const path = `${session.user.id}/${subfolder}/${Date.now()}-${safe}.${ext}`;

    const { data, error } = await supabase.storage
        .from(POST_IMAGES_BUCKET)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "image/jpeg",
        });

    if (error) {
        console.error("Erro ao enviar imagem:", error);

        throw new Error(error.message || "Nao foi possivel enviar a imagem.");
    }

    const { data: pub } = supabase.storage
        .from(POST_IMAGES_BUCKET)
        .getPublicUrl(data.path);

    return pub.publicUrl;
}

function getStorageBaseUrl() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url
        ? `${url}/storage/v1/object/public/${POST_IMAGES_BUCKET}/`
        : "";
}

export function getPostImagePathFromUrl(url) {
    const safeUrl = sanitizeImageUrl(url);
    if (!safeUrl) return null;

    const base = getStorageBaseUrl();
    if (!base || !safeUrl.startsWith(base)) return null;

    return decodeURIComponent(
        safeUrl.slice(base.length).split("?")[0].split("#")[0]
    );
}

export async function deletePostImageByUrl(url) {
    const path = getPostImagePathFromUrl(url);
    if (!path) return;

    const { error } = await supabase.storage
        .from(POST_IMAGES_BUCKET)
        .remove([path]);

    if (error && !error.message?.toLowerCase().includes("not found")) {
        throw error;
    }
}
