import { getAbsoluteUrl } from "../lib/site";
import { getPublishedPostSlugs } from "../services/posts";

export default async function sitemap() {
    const now = new Date();
    const staticRoutes = ["/", "/home", "/about", "/gallery", "/diary"].map((path) => ({
        url: getAbsoluteUrl(path),
        lastModified: now,
    }));

    let posts = [];

    try {
        posts = await getPublishedPostSlugs();
    } catch (error) {
        console.error("Erro ao gerar sitemap:", error);
    }

    const postRoutes = posts.map((post) => ({
        url: getAbsoluteUrl(`/diary/${post.slug}`),
        lastModified: new Date(post.updated_at || post.published_at || post.created_at || now),
    }));

    return [...staticRoutes, ...postRoutes];
}
