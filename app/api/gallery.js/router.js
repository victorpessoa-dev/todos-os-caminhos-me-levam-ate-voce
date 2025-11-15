import prisma from "../../lib/prisma";

export async function getGallery(req, res) {
    const galleryImg = await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.status(200).json(galleryImg);
}

export async function createGalleryImg(req, res) {
    const data = req.json();

    if (!data.urlImage) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    const newGalleryImg = await prisma.gallery.create({
        data: {
            urlImage: data.urlImage,
            description: data.description ?? '',
        },
    });
    res.status(201).json(newGalleryImg);
}

export async function deleteGalleryImg(req) {
    const data = await req.json();

    if (!data.id) {
        return res.status(400).json({ error: "Image ID is required" });
    }

    await prisma.gallery.delete({
        where: { id: data.id },
    });
    res.status(204).end();
}