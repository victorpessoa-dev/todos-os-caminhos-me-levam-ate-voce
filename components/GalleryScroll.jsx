"use client";

import { useEffect, useState, useCallback } from "react";
import GalleryItem from "../components/GalleryItem";
import { getGallery } from "../../../services/gallery";
import { sanitizeImageUrl } from "../../../lib/content";

export default function GalleryScroll({ initialImages, total }) {
    const [images, setImages] = useState(initialImages);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadImages = useCallback(async (currentPage) => {
        if (loading) return;

        setLoading(true);

        try {
            const { items } = await getGallery({
                page: currentPage,
            });

            setImages((prev) => [...prev, ...items]);
            setPage(currentPage);
        } catch (error) {
            console.error("Erro ao carregar galeria:", error);
        }

        setLoading(false);
    }, [loading]);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                if (images.length < total && !loading) {
                    loadImages(page + 1);
                }
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [images, total, page, loading, loadImages]);

    const itemsWithUrl = images
        .map((item) => ({
            ...item,
            safeImageUrl: sanitizeImageUrl(item.image_url),
        }))
        .filter((item) => item.safeImageUrl);

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

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {itemsWithUrl.map((item) => (
                        <GalleryItem key={item.id} {...item} image={item.safeImageUrl} />
                    ))}
                </div>

                <div className="text-center mt-12 animate-fadeIn">
                    <p className="text-sm sm:text-base text-gray-600 italic">
                        {itemsWithUrl.length}{" "}
                        {itemsWithUrl.length === 1
                            ? "momento registrado"
                            : "momentos registrados"}
                    </p>
                </div>

                {loading && (
                    <div className="text-center mt-6 text-gray-500">
                        Carregando mais...
                    </div>
                )}
            </div>
        </div>
    );
}