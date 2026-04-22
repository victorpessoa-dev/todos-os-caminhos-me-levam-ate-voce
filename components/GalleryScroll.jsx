"use client";

import { useMemo, useState } from "react";
import GalleryItem from "../components/GalleryItem";
import { getGallery } from "../services/gallery";
import { sanitizeImageUrl } from "../lib/content";

export default function GalleryScroll({ initialImages, total, pageSize = 12 }) {
    const [images, setImages] = useState(initialImages || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const hasMore = images.length < total;
    const remainingCount = Math.max(total - images.length, 0);

    const itemsWithUrl = useMemo(
        () =>
            images
                .map((item) => ({
                    ...item,
                    safeImageUrl: sanitizeImageUrl(item.image_url),
                }))
                .filter((item) => item.safeImageUrl),
        [images]
    );

    const loadMore = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        getGallery({
            page: page + 1,
            limit: pageSize,
        })
            .then(({ items }) => {
                setImages((prev) => {
                    const nextItems = Array.isArray(items) ? items : [];
                    const existingIds = new Set(prev.map((item) => item.id));

                    return [
                        ...prev,
                        ...nextItems.filter((item) => !existingIds.has(item.id)),
                    ];
                });
                setPage((prev) => prev + 1);
            })
            .catch((error) => {
                console.error("Erro ao carregar galeria:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="page-title">
                        Meus momentos com <span className="text-marsala">Cristo</span>
                    </h1>
                    <p className="page-lead italic">
                        Momentos que me levam até Ele, vividos com o coração.
                    </p>
                </div>

                {itemsWithUrl.length > 0 && (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {itemsWithUrl.map((item) => (
                                <GalleryItem
                                    key={item.id}
                                    {...item}
                                    image={item.safeImageUrl}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-12">
                            <button
                                type="button"
                                onClick={loadMore}
                                disabled={!hasMore || loading}
                                className="px-6 py-3 rounded-lg bg-marsala text-white hover:bg-marsala/90 disabled:bg-gray-300 disabled:text-gray-500 transition shadow-sm"
                            >
                                {loading
                                    ? "Carregando..."
                                    : hasMore
                                        ? "Carregar mais"
                                        : "Você já viu tudo"}
                            </button>

                            <p className="text-sm sm:text-base text-gray-600 italic">
                                {itemsWithUrl.length}{" "}
                                {itemsWithUrl.length === 1
                                    ? "momento registrado"
                                    : "momentos registrados"}
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500">
                                {hasMore
                                    ? `${remainingCount} ${remainingCount === 1 ? "item restante para carregar" : "itens restantes para carregar"}`
                                    : "Nenhum item restante para carregar"}
                            </p>
                        </div>
                    </>
                )}

                {itemsWithUrl.length === 0 && (
                    <div className="text-center py-20 animate-fadeIn">
                        <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">
                            Ainda não há imagens publicadas. Volte em breve para ver os próximos registros.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
