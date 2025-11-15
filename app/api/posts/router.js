import prisma from "../../../lib/prisma";
import slugify from "../../../lib/slugify";

// GET /api/posts
export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return Response.json(posts);
}

// POST /api/posts
export async function POST(req) {
    const data = await req.json();

    if (!data.title) {
        return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
        data: {
            title: data.title,
            slug: slugify(data.title),
            description: data.description ?? '',
            text: data.text ?? '',
            urlImage: data.urlImage ?? null,
        },
    });

    return Response.json(newPost, { status: 201 });
}

// PUT /api/posts
export async function PUT(req) {
    const data = await req.json();

    if (!data.id) {
        return Response.json({ error: "Post ID is required" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
        where: { id: data.id },
        data: {
            title: data.title,
            slug: slugify(data.title),
            description: data.description ?? '',
            text: data.text ?? '',
            urlImage: data.urlImage ?? null,
        },
    });

    return Response.json(updatedPost);
}

// DELETE /api/posts
export async function DELETE(req) {
    const data = await req.json();
    const { ids, id } = data;

    if (id) {
        await prisma.post.delete({ where: { id } });
        return Response.json({ message: "Post deleted successfully" });
    }

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await prisma.post.deleteMany({
            where: { id: { in: ids } },
        });
        return Response.json({ message: `${result.count} posts deleted successfully` });
    }

    return Response.json({ error: "Post ID or IDs array is required" }, { status: 400 });
}

