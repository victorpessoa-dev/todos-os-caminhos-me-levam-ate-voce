import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Erro ao buscar galeria:", error);
        return NextResponse.json({ error: "Erro ao buscar galeria" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { image, caption, reflection } = await request.json();

        const item = await prisma.galleryItem.create({
            data: {
                image,
                caption,
                reflection,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao criar item de galeria:", error);
        return NextResponse.json({ error: "Erro ao criar item de galeria" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const item = await prisma.galleryItem.delete({
            where: { id },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao deletar item de galeria:", error);
        return NextResponse.json({ error: "Erro ao deletar item de galeria" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, image, caption, reflection } = await request.json();
        const item = await prisma.galleryItem.update({
            where: { id },
            data: { image, caption, reflection },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Erro ao atualizar item de galeria:", error);
        return NextResponse.json({ error: "Erro ao atualizar item de galeria" }, { status: 500 });
    }
}
