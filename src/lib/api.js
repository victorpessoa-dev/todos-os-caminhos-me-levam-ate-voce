const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getPosts() {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
}

export async function getPostBySlug(slug) {
    const response = await fetch(`${API_BASE}/posts/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
}

export async function getGalleryItems() {
    const response = await fetch(`${API_BASE}/gallery`);
    if (!response.ok) throw new Error('Failed to fetch gallery items');
    return response.json();
}

export async function getAboutInfo() {
    const response = await fetch(`${API_BASE}/about`);
    if (!response.ok) throw new Error('Failed to fetch about info');
    return response.json();
}