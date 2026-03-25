"use client";

import { useState, useEffect } from "react";
import { getGallery, addGalleryItem, deleteGalleryItem } from "../../../../lib/api/gallery";

export default function AdminGallery() {
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({ title: "", urlImage: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadImages();
    }, []);

    async function loadImages() {
        try {
            const data = await getGallery();
            setImages(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (!form.urlImage.trim()) return setMessage("URL da imagem é obrigatória.");
        setSaving(true);
        setMessage("");
        try {
            const newItem = await addGalleryItem(form);
            setImages((prev) => [newItem, ...prev]);
            setForm({ title: "", urlImage: "" });
            setMessage("Imagem adicionada!");
        } catch {
            setMessage("Erro ao adicionar imagem.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Remover esta imagem da galeria?")) return;
        try {
            await deleteGalleryItem(id);
            setImages((prev) => prev.filter((img) => img.id !== id));
        } catch {
            alert("Erro ao remover imagem.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Galeria</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Adicionar Imagem</h2>
                    <input
                        className="w-full border rounded p-2"
                        placeholder="Título (opcional)"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <input
                        className="w-full border rounded p-2"
                        placeholder="URL da Imagem *"
                        value={form.urlImage}
                        onChange={(e) => setForm({ ...form, urlImage: e.target.value })}
                    />
                    {message && (
                        <p className={`text-sm font-medium ${message.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                    <button
                        onClick={handleAdd}
                        disabled={saving}
                        className="bg-marsala text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Adicionando..." : "+ Adicionar"}
                    </button>
                </div>

                {loading && (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-marsala"></div>
                    </div>
                )}

                {!loading && images.length === 0 && (
                    <p className="text-gray-500 text-center py-12">Nenhuma imagem na galeria.</p>
                )}

                {!loading && images.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <img
                                    src={img.urlImage}
                                    alt={img.title || "Imagem"}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-3 flex items-center justify-between">
                                    <p className="text-sm text-gray-700 truncate">{img.title || "Sem título"}</p>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="text-red-500 text-sm hover:underline ml-2 flex-shrink-0"
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