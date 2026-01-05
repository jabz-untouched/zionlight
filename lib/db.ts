import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * 
 * In development, we need to handle hot reloading without creating
 * multiple Prisma Client instances. In production, a single instance is used.
 * 
 * For serverless environments (Vercel), we use connection pooling
 * to avoid exhausting database connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Connection pool settings for serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
