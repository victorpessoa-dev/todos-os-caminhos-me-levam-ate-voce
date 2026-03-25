"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getPostBySlug } from "../../../../lib/api/posts";

export default function DiaryPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        async function loadPost() {
            try {
                const data = await getPostBySlug(slug);
                if (!data) setNotFound(true);
                else setPost(data);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-beige pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-marsala mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando reflexão...</p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-beige pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="text-6xl mb-6">🕊️</div>
                    <h1 className="font-script text-4xl text-gray-800 mb-4">Reflexão não encontrada</h1>
                    <p className="text-gray-600 mb-8">Esta página não existe ou foi removida.</p>
                    <Link href="/diary" className="inline-block bg-marsala text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                        Voltar ao Diário
                    </Link>
                </div>
            </div>
        );
    }

    const safeDate = new Date(post.updatedAt || post.createdAt || Date.now());

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/diary"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-marsala transition-colors mb-10 group"
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
                    <h1 className="font-script text-4xl sm:text-5xl text-gray-800 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    {post.description && (
                        <p className="text-xl italic text-gray-600 border-l-4 border-marsala pl-4">
                            {post.description}
                        </p>
                    )}
                </div>

                {post.urlImage && (
                    <div className="relative rounded-lg overflow-hidden shadow-xl mb-12 animate-fadeIn">
                        <img
                            src={post.urlImage}
                            alt={post.title}
                            className="w-full h-72 sm:h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 animate-fadeIn">
                    {post.text ? (
                        <div
                            className="prose prose-lg max-w-none prose-headings:font-script prose-a:text-marsala"
                            dangerouslySetInnerHTML={{ __html: post.text }}
                        />
                    ) : (
                        <p className="text-gray-500 italic text-center py-8">
                            Nenhum conteúdo disponível ainda.
                        </p>
                    )}
                </div>

                <div className="mt-12 bg-white bg-opacity-60 p-8 rounded-lg text-center animate-fadeIn">
                    <p className="font-script text-2xl text-gray-700">
                        "Senhor, para onde iremos? Tu tens as palavras da vida eterna."
                    </p>
                    <p className="text-gray-500 mt-2 italic text-sm">João 6, 68</p>
                </div>
            </div>
        </div>
    );
}