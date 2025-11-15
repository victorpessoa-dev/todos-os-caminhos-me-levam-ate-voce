import prisma from '../../lib/prisma';

export async function getPostBySlug(req, { params }) {
    try {
        const postSlug = prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!postSlug) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
        }

        return Response.json(postSlug, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar post:", error);
        return Response.json(
            { error: "Erro ao buscar post" },
            { status: 500 }
        );
    }
}