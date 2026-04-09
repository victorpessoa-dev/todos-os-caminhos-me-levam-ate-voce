"use client";

import { useState, useEffect } from "react";
import {
    getGallery,
    addGalleryItem,
    deleteGalleryItem,
} from "../../../../services/gallery";
import ImageUrlField from "@/components/ImageUrlField";
import { sanitizeImageUrl } from "@/lib/content";

export default function AdminGallery() {
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({
        title: "",
        image_url: "",
        image_alt: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadImages();
    }, []);

    async function loadImages() {
        try {
            const { items } = await getGallery({ page: 1, limit: 20 });
            setImages(items);
        } catch (error) {
            console.error("Erro ao carregar galeria:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (saving) return;

        if (!form.image_url.trim()) {
            return setMessage("URL da imagem e obrigatoria.");
        }

        setSaving(true);
        setMessage("");

        try {
            const newItem = await addGalleryItem({
                title: form.title.trim() || null,
                image_url: form.image_url.trim(),
                image_alt: form.image_alt.trim() || null,
            });

            setImages((prev) => [
                newItem,
                ...(Array.isArray(prev) ? prev : []),
            ]);

            setForm({ title: "", image_url: "", image_alt: "" });
            setMessage("Imagem adicionada!");
        } catch (error) {
            console.error(error);
            setMessage("Erro ao adicionar imagem.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(img) {
        const ok1 = window.confirm(
            `Remover esta imagem da galeria permanentemente?\n\nEsta acao nao pode ser desfeita.`
        );
        if (!ok1) return;

        const ok2 = window.confirm(
            "Confirme novamente: deseja realmente excluir esta imagem?"
        );
        if (!ok2) return;

        try {
            await deleteGalleryItem(img.id);

            setImages((prev) =>
                Array.isArray(prev)
                    ? prev.filter((i) => i.id !== img.id)
                    : []
            );
        } catch (error) {
            console.error(error);
            alert("Erro ao remover imagem.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
                    Galeria
                </h1>

                <div className="admin-card mb-8 space-y-4 p-4 sm:p-6">
                    <h2 className="text-base font-semibold text-gray-800">
                        Adicionar imagem
                    </h2>

                    <div>
                        <label className="label-field">Titulo (opcional)</label>
                        <input
                            className="input-field"
                            placeholder="Titulo"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="label-field">
                            Texto alternativo
                        </label>
                        <input
                            className="input-field"
                            placeholder="Descricao para leitores de tela"
                            value={form.image_alt}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    image_alt: e.target.value,
                                })
                            }
                        />
                    </div>

                    <ImageUrlField
                        label="URL da imagem *"
                        value={form.image_url}
                        onChange={(v) =>
                            setForm({ ...form, image_url: v })
                        }
                        subfolder="gallery"
                        hint="Ou cole uma URL externa."
                    />

                    {message && (
                        <p
                            className={`text-sm font-medium ${message.includes("Erro")
                                ? "text-red-600"
                                : "text-green-700"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={saving}
                        className="btn btn-primary w-full sm:w-auto disabled:pointer-events-none disabled:opacity-50"
                    >
                        {saving ? "Adicionando..." : "+ Adicionar"}
                    </button>
                </div>

                {loading && (
                    <div className="py-10 text-center">
                        <div className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-marsala border-t-transparent" />
                    </div>
                )}

                {!loading && images.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-600">
                        Nenhuma imagem na galeria.
                    </p>
                )}

                {!loading && images.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-marsala/20"
                            >
                                <img
                                    src={
                                        sanitizeImageUrl(img.image_url) ||
                                        "/placeholder.jpg"
                                    }
                                    alt={img.image_alt || img.title || ""}
                                    className="h-40 w-full object-cover"
                                />

                                <div className="flex flex-col items-start gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="break-words text-sm text-gray-700">
                                        {img.title || "Sem titulo"}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(img)
                                        }
                                        className="btn-ghost shrink-0 text-sm text-red-600 hover:bg-red-50 !px-3 !py-2"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}