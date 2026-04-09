import BlogCard from "../../../components/BlogCard";
import { getPublishedPosts } from "../../../services/posts";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Diário",
    description: "Leia os posts publicados do diário e acompanhe reflexões sobre a caminhada com Cristo.",
    path: "/diary",
});

export const revalidate = 300;

export default async function Diary() {
    let posts = [];

    try {
        posts = await getPublishedPosts();
    } catch (error) {
        console.error("Erro ao carregar posts:", error);
    }

    return (
        <div className="min-h-screen bg-beige pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="page-title">
                        Meu Diário com <span className="text-marsala">Cristo</span>
                    </h1>
                    <p className="page-lead italic">
                        Reflexões sobre os caminhos que me levam até Ele, escritas com o coração.
                    </p>
                </div>

                {posts.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard
                                key={post.id}
                                slug={post.slug}
                                title={post.title}
                                description={post.description}
                                cover_image={post.cover_image}
                                cover_image_alt={post.cover_image_alt}
                                published_at={post.published_at}
                                created_at={post.created_at}
                                updated_at={post.updated_at}
                            />
                        ))}
                    </div>
                )}

                {posts.length === 0 && (
                    <div className="text-center py-20 animate-fadeIn">
                        <div className="text-6xl mb-4">📖</div>
                        <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">
                            Ainda não há reflexões publicadas. Volte em breve para ler os primeiros caminhos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
