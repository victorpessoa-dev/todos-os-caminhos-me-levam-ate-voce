export async function getPosts() {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao carregar posts");
    return res.json();
}

export async function getPostBySlug(slug) {
    const res = await fetch(`/api/posts/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao carregar post");
    return res.json();
}

export async function getGalleryItems() {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao carregar galeria");
    return res.json();
}

export async function getAboutInfo() {
    const res = await fetch("/api/about", { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao carregar sobre");
    return res.json();
}
