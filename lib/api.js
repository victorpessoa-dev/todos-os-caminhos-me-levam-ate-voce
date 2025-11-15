export async function getPosts() {
    try {
        const res = await fetch("/api/posts", {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("API retornou formato inválido:", data);
            return [];
        }

        return data;

    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug) {
    try {
        const res = await fetch(`/api/posts/${slug}`, {
            method: "GET",
            cache: "no-store",
        });

        if (res.status === 404) {
            return null;
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch post: ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        console.error(`Error fetching post ${slug}:`, error);
        return null;
    }
}

export async function getAboutInfo() {
    try {
        const res = await fetch("/api/about", {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch about info: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching about info:", error);
        return {
            title: 'Sobre Mim',
            description: '',
            urlImage: '/placeholder.jpg'
        };
    }
}

export async function getGallery() {
    try {
        const res = await fetch("/api/gallery", {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch gallery images: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Gallery data is not an array", data);
            return [];
        }

        return data;

    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return [];
    }
}