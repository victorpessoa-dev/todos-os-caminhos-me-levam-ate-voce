"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPosts, deletePost } from "../../../../lib/api/posts";

export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            const data = await getPosts();
            setPosts(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Deseja excluir este post?")) return;
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("Erro ao excluir post.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Posts do Diário</h1>
                    <button
                        onClick={() => router.push("/admin/posts/new")}
                        className="bg-marsala text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        + Novo Post
                    </button>
                </div>

                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-marsala mb-3"></div>
                        <p className="text-gray-500">Carregando posts...</p>
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <p className="text-gray-500 text-center py-20">Nenhum post encontrado.</p>
                )}

                {!loading && posts.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Título</th>
                                    <th className="px-6 py-3 text-left">Slug</th>
                                    <th className="px-6 py-3 text-left">Criado em</th>
                                    <th className="px-6 py-3 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">
                                            {post.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {post.slug}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => router.push(`/admin/posts/${post.id}`)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}