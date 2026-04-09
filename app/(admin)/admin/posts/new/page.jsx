"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../../../services/posts";
import ImageUrlField from "@/components/ImageUrlField";

function slugify(value) {
    return value
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeContent(text) {
    if (!text) return "";

    return text
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/>\s+</g, "><")
        .trim();
}

export default function AdminNewPost() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [coverImageAlt, setCoverImageAlt] = useState("");
    const [status, setStatus] = useState("draft");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function onTitleChange(v) {
        setTitle(v);
        if (!slugTouched) setSlug(slugify(v));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const finalSlug = (slug || slugify(title)).trim();
        if (!title.trim() || !finalSlug) {
            setError("Titulo e slug sao obrigatorios.");
            return;
        }
        setSaving(true);
        try {
            await createPost({
                title: title.trim(),
                slug: finalSlug,
                description: description.trim() || "",
                content: normalizeContent(content),
                cover_image: coverImage.trim() || null,
                cover_image_alt: coverImageAlt.trim() || null,
                status,
                published_at: status === "published" ? new Date().toISOString() : null,
            });
            router.push("/admin/posts");
        } catch {
            setError("Erro ao criar post. Verifique se o slug ja existe.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-3xl">Novo post</h1>

                <form onSubmit={handleSubmit} className="admin-card space-y-4 p-4 sm:p-6">
                    <div>
                        <label className="label-field">Titulo</label>
                        <input
                            className="input-field"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="label-field">Slug</label>
                        <input
                            className="input-field font-mono text-xs sm:text-sm"
                            value={slug}
                            onChange={(e) => {
                                setSlugTouched(true);
                                setSlug(e.target.value);
                            }}
                            placeholder="url-amigavel"
                        />
                    </div>
                    <div>
                        <label className="label-field">Resumo</label>
                        <textarea
                            className="input-field min-h-[4.5rem]"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                            {saving ? "Salvando..." : "Salvar"}
                        </button>
                        <button type="button" onClick={() => router.back()} className="btn btn-outline w-full sm:w-auto">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
