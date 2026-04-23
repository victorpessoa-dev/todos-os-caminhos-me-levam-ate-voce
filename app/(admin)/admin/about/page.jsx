"use client";

import { useState, useEffect } from "react";
import { getAboutInfo, upsertAbout } from "../../../../services/about";
import ImageUrlField from "@/components/ImageUrlField";

export default function AdminAbout() {
    const [id, setId] = useState(null);
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const data = await getAboutInfo();
                if (data) {
                    setId(data.id);
                    setDescription(data.description || "");
                    setImageUrl(data.image_url || "");
                }
            } catch {
                setMessage("Erro ao carregar dados.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleSave() {
        setSaving(true);
        setMessage("");
        try {
            await upsertAbout(id, { description, image_url: imageUrl || null });
            setMessage("Salvo com sucesso.");
        } catch (error) {
            console.error(error);
            setMessage(error?.message || "Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-marsala border-t-transparent" aria-hidden />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">Sobre mim (site)</h1>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
                    <ImageUrlField
                        label="URL da imagem"
                        value={imageUrl}
                        onChange={setImageUrl}
                        subfolder="about"
                        hint="Bucket post-images ou link externo."
                    />
                    <div>
                        <label className="label-field">Descrição (HTML)</label>
                        <textarea
                            className="input-field min-h-[200px] font-mono text-xs sm:text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {message && (
                        <p className={`text-sm font-medium ${message.includes("Erro") ? "text-red-600" : "text-green-700"}`}>
                            {message}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {saving ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
