import prisma from "../../lib/prisma";

export async function GET() {
    try {
        const galleryImages = await prisma.gallery.findMany({
            orderBy: { createdAt: "desc" },
        });

        return Response.json(galleryImages, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar galeria:", error);

        return Response.json(
            { error: "Erro ao buscar imagens da galeria" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const data = await req.json();

        if (!data.urlImage) {
            return Response.json(
                { error: "URL da imagem é obrigatória" },
                { status: 400 }
            );
        }

        try {
            new URL(data.urlImage);
        } catch {
            return Response.json(
                { error: "URL da imagem inválida" },
                { status: 400 }
            );
        }

        const newGalleryImage = await prisma.gallery.create({
            data: {
                urlImage: data.urlImage,
                title: data.title ?? '',
            },
        });

        return Response.json(newGalleryImage, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar imagem da galeria:", error);

        return Response.json(
            { error: "Erro ao adicionar imagem à galeria" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const data = await req.json();

        if (!data.id) {
            return Response.json(
                { error: "ID da imagem é obrigatório" },
                { status: 400 }
            );
        }

        const existingImage = await prisma.gallery.findUnique({
            where: { id: data.id },
        });

        if (!existingImage) {
            return Response.json(
                { error: "Imagem não encontrada" },
                { status: 404 }
            );
        }

        await prisma.gallery.delete({
            where: { id: data.id },
        });

        return Response.json(
            { message: "Imagem removida com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao deletar imagem da galeria:", error);

        return Response.json(
            { error: "Erro ao remover imagem da galeria" },
            { status: 500 }
        );
    }
}
