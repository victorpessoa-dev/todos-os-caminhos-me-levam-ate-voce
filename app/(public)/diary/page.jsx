import BlogCard from "../../../components/BlogCard";
import { getPublishedPosts } from "../../../services/posts";
import { buildMetadata } from "../../../lib/site";

export const metadata = buildMetadata({
    title: "Diário",
    description: "Leia os posts publicados do diário e acompanhe reflexões sobre a caminhada com Cristo.",
    path: "/diary",
});

export const revalidate = 300;
export const POSTS_PER_PAGE = 10;

export default async function Diary({ searchParams }) {
    const currentPage = Number(searchParams?.page || 1);

    let posts = [];
    let totalPages = 0;

    try {
        const { posts: data, total } = await getPublishedPosts({
            page: currentPage,
            limit: POSTS_PER_PAGE,
        });

        posts = data;
        totalPages = Math.ceil(total / POSTS_PER_PAGE);
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
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <BlogCard key={post.id} {...post} />
                            ))}
                        </div>

                        <div className="flex justify-center items-center gap-4 mt-12">
                            {currentPage > 1 && (
                                <a
                                    href={`?page=${currentPage - 1}`}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                >
                                    ← Anterior
                                </a>
                            )}

                            <span className="text-gray-600 text-sm">
                                Página {currentPage} de {totalPages}
                            </span>

                            {currentPage < totalPages && (
                                <a
                                    href={`?page=${currentPage + 1}`}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Próxima →
                                </a>
                            )}
                        </div>
                    </>
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
