import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * 
 * In development, we need to handle hot reloading without creating
 * multiple Prisma Client instances. In production, a single instance is used.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
