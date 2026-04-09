import Link from "next/link";
import { Heart } from "lucide-react";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Inicio",
    description: "Pagina inicial do diario cristao Todos os Caminhos me levam ate Voce.",
    path: "/",
});

export default function Home() {
    return (
        <div className="min-h-screen">
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-beige to-white"></div>

                <div className="absolute inset-0 opacity-5">
                    <div className="absolute left-6 top-20 text-6xl sm:left-20 sm:text-9xl">✝</div>
                    <div className="absolute bottom-40 right-8 text-6xl sm:right-32 sm:text-9xl">✝</div>
                    <div className="absolute right-8 top-1/3 text-4xl sm:right-1/4 sm:text-6xl">✝</div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-4 pt-24 text-center sm:px-6 animate-fadeIn">
                    <Heart className="mx-auto mb-5 h-12 w-12 animate-pulse text-marsala sm:mb-6 sm:h-16 sm:w-16" />

                    <h1 className="hero-title">
                        Todos os caminhos me levam ate{" "}
                        <span className="text-marsala">Voce</span>
                    </h1>

                    <p className="hero-lead italic text-gray-600">
                        Um diario sobre minha vida com Cristo.
                    </p>

                    <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                        <Link href="/diary" className="btn-hero w-full sm:w-auto">
                            Entrar no Diario
                        </Link>
                        <Link href="/gallery" className="btn-hero w-full sm:w-auto">
                            Ver galeria
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce sm:block">
                    <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-400 p-2">
                        <div className="h-3 w-1 rounded-full bg-gray-400"></div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 text-center md:grid-cols-2 md:gap-8">
                        <div className="p-6 sm:p-8 animate-fadeIn">
                            <div className="mb-4 text-5xl">📖</div>
                            <h3 className="section-card-title">Meu Diario</h3>
                            <p className="text-base leading-relaxed text-gray-600">
                                Reflexoes diarias sobre minha caminhada com Cristo e os ensinamentos
                                que Ele me revela.
                            </p>
                        </div>

                        <div className="p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                            <div className="mb-4 text-5xl">📷</div>
                            <h3 className="section-card-title">Galeria</h3>
                            <p className="text-base leading-relaxed text-gray-600">
                                Momentos capturados em fotos, cada imagem conta uma historia de fe e
                                gratidao.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-beige py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <blockquote className="font-script text-2xl leading-relaxed text-gray-800 sm:text-3xl md:text-4xl">
                        "Confia ao Senhor a tua sorte, espera nele, e ele agira."
                    </blockquote>
                    <p className="mt-4 text-sm italic text-gray-600 sm:text-base">Salmo 37, 5</p>
                </div>
            </section>
        </div>
    );
}
