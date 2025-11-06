import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                urlImage: true,
                createdAt: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { title, slug, description, urlImage, content } = await request.json();

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                description,
                urlImage,
                content,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Erro ao criar post:", error);
        return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { slug } = await request.json();

        const post = await prisma.post.delete({
            where: { slug },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Erro ao deletar post:", error);
        return NextResponse.json({ error: "Erro ao deletar post" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { title, slug, description, urlImage, content } = await request.json();

        const post = await prisma.post.update({
            where: { slug },
            data: {
                title,
                description,
                urlImage,
                content,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Erro ao atualizar post:", error);
        return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
    }
}

