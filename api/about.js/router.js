import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const about = await prisma.about.findFirst({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(about || {});
    } catch (error) {
        console.error("Erro ao buscar informações 'Sobre':", error);
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { title, content } = await request.json();

        const about = await prisma.about.create({
            data: {
                title,
                content,
            },
        });

        return NextResponse.json(about);
    } catch (error) {
        console.error("Erro ao criar informações 'Sobre':", error);
        return NextResponse.json({ error: "Erro ao criar dados" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, title, content } = await request.json();

        const about = await prisma.about.update({
            where: { id },
            data: { title, content },
        });

        return NextResponse.json(about);
    } catch (error) {
        console.error("Erro ao atualizar informações 'Sobre':", error);
        return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const about = await prisma.about.delete({
            where: { id },
        });

        return NextResponse.json(about);
    } catch (error) {
        console.error("Erro ao deletar informações 'Sobre':", error);
        return NextResponse.json({ error: "Erro ao deletar dados" }, { status: 500 });
    }
}
