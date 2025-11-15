import prisma from '../../lib/prisma';

export async function getAbout() {
    const aboutInfo = await prisma.about.findFirst({
        where: { id: 'about' },
    });
    return aboutInfo;
}

export async function updateAbout(req) {
    const data = await req.json();

    if (!data.title) {
        return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    const about = await prisma.about.upsert({
        where: { id: 'about' },
        update: {
            description: data.description ?? '',
            urlImage: data.urlImage ?? null,
        },
        create: {
            id: 'about',
            description: data.description ?? '',
            urlImage: data.urlImage ?? null,
        },
    });

    return Response.json(about, { status: 200 });
}