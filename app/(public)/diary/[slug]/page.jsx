import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { sanitizeHtml, sanitizeImageUrl } from "../../../../lib/content";
import { buildMetadata } from "../../../../lib/site";
import { getPublishedPostBySlug, getPublishedPostSlugs } from "../../../../services/posts";

export const revalidate = 300;

export async function generateStaticParams() {
    const posts = await getPublishedPostSlugs();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        return buildMetadata({
            title: "Post não encontrado",
            description: "Este post não existe ou ainda não foi publicado.",
            path: `/diary/${slug}`,
        });
    }

    return buildMetadata({
        title: post.title,
        description: post.description || "Leia esta reflexão do diário.",
        path: `/diary/${post.slug}`,
        image: sanitizeImageUrl(post.cover_image) || undefined,
        type: "article",
    });
}

export default async function DiaryPost({ params }) {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const safeDate = new Date(post.published_at || post.updated_at || post.created_at || Date.now());
    const safeCoverImage = sanitizeImageUrl(post.cover_image);
    const safeContent = sanitizeHtml(post.content);

    return (
        <div className="min-h-screen bg-beige pt-5 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/diary"
                    className="btn-ghost -ml-3 text-gray-500 hover:text-marsala mb-10 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar ao Diário
                </Link>

                <div className="mb-10 animate-fadeIn">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <CalendarDays className="w-4 h-4" />
                        <time dateTime={safeDate.toISOString()}>
                            {safeDate.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </time>
                    </div>

                    {safeCoverImage && (
                        <div className="relative rounded-lg overflow-hidden shadow-xl mb-12 animate-fadeIn">
                            <img
                                src={safeCoverImage}
                                alt={post.cover_image_alt || post.title}
                                className="w-full h-72 sm:h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    )}

                    <h1 className="font-script text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    {post.description && (
                        <p className="text-base sm:text-lg italic text-gray-600 border-l-4 border-marsala pl-4 leading-relaxed">
                            {post.description}
                        </p>
                    )}
                </div>


                <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 animate-fadeIn">
                    {safeContent ? (
                        <div
                            className="prose prose-base sm:prose-lg max-w-none text-gray-800 prose-headings:font-script prose-headings:text-gray-900 prose-a:text-marsala prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                            dangerouslySetInnerHTML={{ __html: safeContent }}
                        />
                    ) : (
                        <p className="text-gray-500 italic text-center py-8">
                            Nenhum conteúdo disponível ainda.
                        </p>
                    )}
                </div>

                <div className="mt-12 bg-white bg-opacity-60 p-8 rounded-lg text-center animate-fadeIn">
                    <p className="font-script text-xl sm:text-2xl text-gray-700 leading-snug">
                        "Senhor, para onde iremos? Tu tens as palavras da vida eterna."
                    </p>
                    <p className="text-gray-500 mt-2 italic text-xs sm:text-sm">João 6, 68</p>
                </div>
            </div>
        </div>
    );
}
