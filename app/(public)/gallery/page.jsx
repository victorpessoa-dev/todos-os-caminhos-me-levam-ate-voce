import GalleryScroll from "../../../components/GalleryScroll";
import { getGallery } from "../../../services/gallery";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Galeria",
    description: "Momentos e imagens que acompanham a jornada do diário com Cristo.",
    path: "/gallery",
});

export const revalidate = 300;
export const GALLERY_PER_PAGE = 12;

export default async function Gallery() {
    let images = [];
    let total = 0;

    try {
        const { items, total: count } = await getGallery({
            page: 1,
            limit: GALLERY_PER_PAGE,
        });

        images = items;
        total = count || items.length;
    } catch (error) {
        console.error("Erro ao carregar galeria:", error);
    }

    if (images.length === 0) {
        console.warn("Galeria pública sem imagens carregadas.");
    }

    return (
        <GalleryScroll
            initialImages={images}
            total={total}
            pageSize={GALLERY_PER_PAGE}
        />
    );
}
