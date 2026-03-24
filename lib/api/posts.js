import { supabase } from "../supabaseClient";

export async function getPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, description, urlImage, createdAt, updatedAt")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Erro ao buscar posts:", error);
        throw error;
    }

    return data || [];
}

export async function getPostBySlug(slug) {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Erro ao buscar post:", error);
        throw error;
    }

    return data;
}

export async function createPost(payload) {
    const { data, error } = await supabase
        .from("posts")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePost(id, payload) {
    const { data, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePost(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
}