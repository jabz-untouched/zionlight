import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { DEFAULT_SEO } from "@/lib/seo";

// Force dynamic generation to avoid build-time DB access
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

/**
 * Dynamic sitemap generation
 * Includes all public pages, blog posts, and events
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DEFAULT_SEO.siteUrl;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        isFeatured: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: post.isFeatured ? 0.8 : 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch blog posts", error);
  }

  // Dynamic programs
  let programs: MetadataRoute.Sitemap = [];
  try {
    const programList = await db.program.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    programs = programList.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified: program.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch programs", error);
  }

  // Dynamic events (only published and not too far in the past)
  let events: MetadataRoute.Sitemap = [];
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const eventList = await db.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: sixMonthsAgo },
      },
      select: {
        slug: true,
        updatedAt: true,
        startDate: true,
      },
      orderBy: { startDate: "desc" },
    });

    events = eventList.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: event.startDate > new Date() ? ("daily" as const) : ("monthly" as const),
      priority: event.startDate > new Date() ? 0.8 : 0.5,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch events", error);
  }

  return [...staticPages, ...blogPosts, ...programs, ...events];
}
