import { Heart, BookOpen, Sunrise } from "lucide-react";
import { getAboutInfo } from "../../../services/about";
import { sanitizeHtml, sanitizeImageUrl } from "../../../lib/content";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Sobre Mim",
    description: "Conheça a autora e a jornada de fé por trás do diário.",
    path: "/about",
});

export const revalidate = 300;

export default async function About() {
    const aboutInfo = await getAboutInfo();
    const safeImageUrl = sanitizeImageUrl(aboutInfo?.image_url);
    const safeDescription = sanitizeHtml(aboutInfo?.description);

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="page-title">Sobre Mim</h1>
                    <p className="page-lead italic">
                        Uma peregrina em busca de Cristo
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-md overflow-hidden mb-12 animate-fadeIn">
                    {safeImageUrl && (
                        <div className="relative h-80">
                            <img
                                src={safeImageUrl}
                                alt="Sobre mim"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        {safeDescription ? (
                            <div
                                className="prose prose-base sm:prose-lg max-w-none text-gray-800 prose-headings:font-script prose-a:text-marsala prose-a:no-underline hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: safeDescription }}
                            />
                        ) : (
                            <p className="text-base text-gray-600">Nenhuma descrição disponível no momento.</p>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {[
                        {
                            icon: <Sunrise className="w-12 h-12 text-marsala mx-auto mb-4" />,
                            title: "Fé",
                            text: "A fé é o alicerce desta jornada. Confio no plano de Deus para minha vida.",
                            delay: "0s",
                        },
                        {
                            icon: <BookOpen className="w-12 h-12 text-marsala mx-auto mb-4" />,
                            title: "Palavra",
                            text: "A Bíblia é meu guia diário, fonte de sabedoria e consolo.",
                            delay: "0.1s",
                        },
                        {
                            icon: <Heart className="w-12 h-12 text-marsala mx-auto mb-4" />,
                            title: "Amor",
                            text: "O amor de Cristo me transforma e me move a amar o próximo.",
                            delay: "0.2s",
                        },
                    ].map(({ icon, title, text, delay }, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm text-center animate-fadeIn hover:border-marsala/15 transition-colors"
                            style={{ animationDelay: delay }}
                        >
                            {icon}
                            <h3 className="section-card-title">{title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/90 border border-gray-100 p-8 rounded-lg shadow-sm">
                    <p className="font-script text-xl sm:text-2xl text-gray-800 text-center leading-snug">
                        "Senhor, para onde iremos? Tu tens as palavras da vida eterna."
                    </p>
                    <p className="text-center text-sm text-gray-600 mt-4 italic">João 6, 68</p>
                </div>
            </div>
        </div>
    );
}
