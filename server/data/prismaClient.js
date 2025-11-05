import { PrismaClient } from '@prisma/client';

// Create a single shared Prisma client instance
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
    global.prisma = prisma;
}