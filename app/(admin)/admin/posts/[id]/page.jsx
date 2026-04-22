"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, updatePost } from "../../../../../services/posts";
import ImageUrlField from "@/components/ImageUrlField";
import { normalizeSlugInput } from "@/lib/content";

export default function AdminEditPost() {
    const { id } = useParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [coverImageAlt, setCoverImageAlt] = useState("");
    const [status, setStatus] = useState("draft");
    const [publishedAt, setPublishedAt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const post = await getPostById(id);

                if (cancelled) return;

                if (!post) {
                    setLoadError(true);
                    return;
                }

                setTitle(post.title || "");
                setSlug(post.slug || "");
                setDescription(post.description || "");
                setContent(post.content || "");
                setCoverImage(post.cover_image || "");
                setCoverImageAlt(post.cover_image_alt || "");
                setStatus(post.status || "draft");
                setPublishedAt(post.published_at || null);

            } catch {
                if (!cancelled) setLoadError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const normalizedSlug = normalizeSlugInput(slug);

        if (!title.trim() || !normalizedSlug) {
            setError("Titulo e slug sao obrigatorios.");
            return;
        }

        let nextPublishedAt = publishedAt;
        if (status === "published" && !nextPublishedAt) {
            nextPublishedAt = new Date().toISOString();
        }
        if (status === "draft") {
            nextPublishedAt = null;
        }

        setSaving(true);
        try {
            await updatePost(id, {
                title: title.trim(),
                slug: normalizedSlug,
                description: description.trim() || "",
                content: content.trim() || "",
                cover_image: coverImage.trim() || null,
                cover_image_alt: coverImageAlt.trim() || null,
                status,
                published_at: nextPublishedAt,
            });
            router.push("/admin/posts");
        } catch {
            setError("Erro ao atualizar post.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-marsala border-t-transparent" aria-hidden />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
                <div className="mx-auto max-w-lg text-center">
                    <p className="mb-6 text-base leading-relaxed text-gray-700">
                        Post nao encontrado ou voce nao tem permissao para edita-lo.
                    </p>
                    <button type="button" onClick={() => router.push("/admin/posts")} className="btn btn-primary w-full sm:w-auto">
                        Voltar a lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Editar post</h1>
                <p
                    className={`mb-6 mt-2 rounded-lg border px-3 py-2.5 text-sm ${status === "published"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                        }`}
                >
                    {status === "published"
                        ? "Publicado - visivel para todos no site."
                        : "Rascunho - visivel apenas no painel administrativo."}
                </p>

                <form onSubmit={handleSubmit} className="admin-card space-y-4 p-4 sm:p-6">
                    <div>
                        <label className="label-field">Titulo</label>
                        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label className="label-field">Slug</label>
                        <input className="input-field font-mono text-xs sm:text-sm" value={slug} onChange={(e) => setSlug(normalizeSlugInput(e.target.value))} required />
                    </div>
                    <div>
                        <label className="label-field">Resumo</label>
                        <textarea className="input-field min-h-[4.5rem]" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <ImageUrlField
                        label="URL da capa"
                        value={coverImage}
                        onChange={setCoverImage}
                        subfolder="covers"
                        hint="Bucket publico post-images no Supabase."
                    />
                    <div>
                        <label className="label-field">Texto alternativo da capa</label>
                        <input className="input-field" value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} />
                    </div>
                    <div>
                        <label className="label-field">Conteudo (HTML)</label>
                        <textarea
                            className="input-field min-h-[240px] font-mono text-xs sm:text-sm"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="label-field">Status</label>
                        <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex flex-col flex-wrap gap-3 pt-2 sm:flex-row">
                        <button type="submit" disabled={saving} className="btn btn-primary w-full sm:w-auto disabled:pointer-events-none disabled:opacity-50">
                            {saving ? "Salvando..." : "Salvar alteracoes"}
                        </button>
                        <button type="button" onClick={() => router.back()} className="btn btn-outline w-full sm:w-auto">
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
