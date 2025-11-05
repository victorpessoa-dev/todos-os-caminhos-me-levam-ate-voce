import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './prismaClient.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Get single post by slug
app.get('/api/posts/:slug', async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { slug: req.params.slug }
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching post' });
    }
});

// Get gallery items
app.get('/api/gallery', async (req, res) => {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching gallery items' });
    }
});

// Get about info
app.get('/api/about', async (req, res) => {
    try {
        const about = await prisma.about.findFirst();
        if (!about) {
            return res.status(404).json({ error: 'About info not found' });
        }
        res.json(about);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching about info' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});