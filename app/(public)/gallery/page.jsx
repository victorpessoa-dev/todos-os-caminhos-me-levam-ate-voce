import GalleryScroll from "../../../components/GalleryScroll";
import { getGallery } from "../../../services/gallery";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Galeria",
    description: "Momentos e imagens que acompanham a jornada do diário com Cristo.",
    path: "/gallery",
});

export const revalidate = 300;

export default async function Gallery() {
    let images = [];
    let total = 0;

    try {
        const { items, total: count } = await getGallery({ page: 1 });
        images = items;
        total = count;
    } catch (error) {
        console.error("Erro ao carregar galeria:", error);
    }

    return <GalleryScroll initialImages={images} total={total} />;
}