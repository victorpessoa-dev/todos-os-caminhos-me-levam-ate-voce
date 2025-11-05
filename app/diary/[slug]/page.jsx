import { getPostBySlug } from '@/lib/api';
import { getPosts } from '@/lib/api';

export default async function BlogPostPage({ params }) {
    const { slug } = params;
    const post = await getPostBySlug(slug);

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {post.image && (
                        <div className="relative h-96">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-8">
                            <h1 className="font-script text-4xl sm:text-5xl text-gray-800 mb-4">
                                {post.title}
                            </h1>
                            <time className="text-gray-600">
                                {new Date(post.date).toLocaleDateString('pt-BR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>

                        <div
                            className="prose prose-lg max-w-none mx-auto"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}