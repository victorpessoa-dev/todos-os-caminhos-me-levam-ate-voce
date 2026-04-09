"use client";

import { useRef, useState } from "react";
import { uploadPostImage } from "../services/storage";

export default function ImageUrlField({
    label,
    value,
    onChange,
    subfolder = "uploads",
    placeholder = "https://...",
    hint,
}) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    async function onPickFile(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setUploadError("Escolha um arquivo de imagem (JPG, PNG, WebP).");
            return;
        }
        setUploading(true);
        setUploadError("");
        try {
            const url = await uploadPostImage(file, subfolder);
            onChange(url);
        } catch (err) {
            setUploadError(err?.message || "Nao foi possivel enviar a imagem.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label className="label-field">{label}</label>
            <input
                className="input-field"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    className="btn btn-outline w-full sm:w-auto text-sm !px-4 !py-2 disabled:opacity-50"
                >
                    {uploading ? "Enviando..." : "Enviar imagem (Storage)"}
                </button>
                {hint && <span className="text-xs leading-relaxed text-gray-500">{hint}</span>}
            </div>
            {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
            {value?.startsWith("http") && (
                <div className="mt-3 max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img src={value} alt="" className="h-28 w-full object-cover" />
                </div>
            )}
        </div>
    );
}
