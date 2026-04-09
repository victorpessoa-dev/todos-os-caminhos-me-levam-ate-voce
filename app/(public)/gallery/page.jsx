import GalleryItem from "../../../components/GalleryItem";
import { getGallery } from "../../../services/gallery";
import { sanitizeImageUrl } from "../../../lib/content";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Galeria",
    description: "Momentos e imagens que acompanham a jornada do diário com Cristo.",
    path: "/gallery",
});

export const revalidate = 300;

export default async function Gallery() {
    let images = [];

    try {
        images = await getGallery();
    } catch (error) {
        console.error("Erro ao carregar galeria:", error);
    }

    const itemsWithUrl = images
        .map((item) => ({ ...item, safeImageUrl: sanitizeImageUrl(item.image_url) }))
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

                {itemsWithUrl.length > 0 && (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {itemsWithUrl.map((item) => (
                                <GalleryItem
                                    key={item.id}
                                    image={item.safeImageUrl}
                                    caption={item.title || "Momento com Cristo"}
                                    altText={item.image_alt}
                                    reflection={item.title}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-12 animate-fadeIn">
                            <p className="text-sm sm:text-base text-gray-600 italic">
                                {itemsWithUrl.length}{" "}
                                {itemsWithUrl.length === 1 ? "momento registrado" : "momentos registrados"}
                            </p>
                        </div>
                    </>
                )}

                {itemsWithUrl.length === 0 && (
                    <div className="text-center py-20 animate-fadeIn">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-600 text-base mb-2">Ainda não há momentos publicados.</p>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                            Volte em breve para ver os primeiros registros desta jornada.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
