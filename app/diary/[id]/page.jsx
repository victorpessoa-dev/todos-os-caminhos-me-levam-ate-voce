import Link from 'next/link';
// import postsData from '../../../../src/data/posts.json';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function PostPage({ params }) {
    const { id } = params;
    const post = postsData.posts.find((p) => p.id === id);

    if (!post) {
        return (
            <div className="min-h-screen bg-beige pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xl text-gray-600">Post não encontrado.</p>
                    <Link href="/diary" className="inline-block mt-8 text-gold hover:text-gray-800 font-medium">
                        ← Voltar ao Diário
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
                <Link href="/diary" className="inline-flex items-center text-gold hover:text-gray-800 font-medium mb-8 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Voltar ao Diário
                </Link>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="relative h-96">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <h1 className="font-script text-4xl sm:text-5xl text-white mb-4">
                                {post.title}
                            </h1>
                            <div className="flex items-center text-white/90">
                                <Calendar className="w-5 h-5 mr-2" />
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        <div className="prose prose-lg max-w-none">
                            {post.content.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="font-script text-2xl text-center text-gray-600">
                                Que esta reflexão toque seu coração assim como tocou o meu. ✝
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
