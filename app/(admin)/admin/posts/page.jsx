"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPosts, deletePost } from "../../../../services/posts";

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

    async function handleDelete(post) {
        const label = post.status === "published" ? "publicado" : "rascunho";
        const ok1 = window.confirm(
            `Excluir permanentemente o post "${post.title}" (${label})?\n\nEsta acao nao pode ser desfeita.`
        );
        if (!ok1) return;
        const ok2 = window.confirm("Confirme novamente: deseja realmente excluir este post?");
        if (!ok2) return;
        try {
            await deletePost(post.id);
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
        } catch {
            alert("Erro ao excluir post.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Posts do Diario</h1>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-600">
                            O site publico so exibe posts publicados. Rascunhos ficam visiveis apenas aqui.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/posts/new")}
                        className="btn btn-primary w-full shrink-0 sm:w-auto"
                    >
                        + Novo post
                    </button>
                </div>

                {loading && (
                    <div className="py-20 text-center">
                        <div className="mb-3 inline-block h-10 w-10 animate-spin rounded-full border-2 border-marsala border-t-transparent" aria-hidden />
                        <p className="text-sm text-gray-600">Carregando posts...</p>
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <p className="py-20 text-center text-gray-500">Nenhum post encontrado.</p>
                )}

                {!loading && posts.length > 0 && (
                    <>
                        <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50 uppercase tracking-wide text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Titulo</th>
                                        <th className="px-6 py-3 text-left">Slug</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Criado em</th>
                                        <th className="px-6 py-3 text-left">Acoes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id} className="border-t border-gray-100 transition-colors hover:bg-beige/40">
                                            <td className="max-w-xs truncate px-6 py-4 font-medium text-gray-800">
                                                {post.title}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {post.slug}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${
                                                        post.status === "published"
                                                            ? "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200"
                                                            : "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200"
                                                    }`}
                                                >
                                                    {post.status === "published" ? "Publicado" : "Rascunho"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {post.created_at
                                                    ? new Date(post.created_at).toLocaleDateString("pt-BR")
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                                                        className="btn-ghost text-marsala hover:bg-marsala/5 !px-2 !py-1 text-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(post)}
                                                        className="btn-ghost text-red-600 hover:bg-red-50 !px-2 !py-1 text-sm"
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

                        <div className="grid gap-4 md:hidden">
                            {posts.map((post) => (
                                <div key={post.id} className="admin-card p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="break-words text-base font-semibold text-gray-900">
                                                {post.title}
                                            </h2>
                                            <p className="mt-1 break-all font-mono text-xs text-gray-500">{post.slug}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 inline-block rounded-md px-2.5 py-1 text-xs font-medium ${
                                                post.status === "published"
                                                    ? "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200"
                                                    : "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200"
                                            }`}
                                        >
                                            {post.status === "published" ? "Publicado" : "Rascunho"}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm text-gray-500">
                                        {post.created_at
                                            ? new Date(post.created_at).toLocaleDateString("pt-BR")
                                            : "—"}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/admin/posts/${post.id}`)}
                                            className="btn-ghost !px-3 !py-2 text-marsala hover:bg-marsala/5"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(post)}
                                            className="btn-ghost !px-3 !py-2 text-red-600 hover:bg-red-50"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
