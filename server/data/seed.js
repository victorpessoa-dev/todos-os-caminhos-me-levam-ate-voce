import { prisma } from './prismaClient.js';

async function main() {
    // Clean existing data
    await prisma.post.deleteMany();
    await prisma.galleryItem.deleteMany();
    await prisma.about.deleteMany();

    console.log('Seeding database...');

    // Create Posts
    const postsData = posts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.date),
        excerpt: post.excerpt,
        image: post.image,
        content: post.content
    }));

    await prisma.post.createMany({
        data: postsData
    });

    // Create Gallery Items
    const galleryData = gallery.map(item => ({
        url: item.url,
        caption: item.caption
    }));

    await prisma.galleryItem.createMany({
        data: galleryData
    });

    // Create About
    await prisma.about.create({
        data: {
            title: about.title,
            description: about.description,
            image: about.image
        }
    });

    console.log('Database seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });