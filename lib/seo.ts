import type { Metadata } from "next";
import { db } from "./db";

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO = {
  siteName: "Zionlight Family Foundation",
  siteDescription: "Empowering communities through compassion and sustainable development.",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultLocale: "en",
  twitterHandle: "@zionlightfamily",
  ogType: "website" as const,
};

/**
 * Supported locales for i18n
 */
export const SUPPORTED_LOCALES = ["en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * SEO metadata input options
 */
export interface SEOInput {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  locale?: SupportedLocale;
  publishedTime?: Date;
  modifiedTime?: Date;
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * Generate metadata for a page
 * Follows priority: provided input → global defaults
 */
export function generateMetadata(input: SEOInput = {}): Metadata {
  const {
    title,
    description = DEFAULT_SEO.siteDescription,
    keywords,
    ogImage,
    ogType = DEFAULT_SEO.ogType,
    canonicalUrl,
    noIndex = false,
    noFollow = false,
    locale = DEFAULT_SEO.defaultLocale,
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  } = input;

  const metadata: Metadata = {
    title: title || DEFAULT_SEO.siteName,
    description,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: canonicalUrl,
      // Prepare for hreflang support
      languages: {
        "en": canonicalUrl || DEFAULT_SEO.siteUrl,
        // Add more locales as they're implemented:
        // "es": `${DEFAULT_SEO.siteUrl}/es${canonicalUrl?.replace(DEFAULT_SEO.siteUrl, "") || ""}`,
      },
    },
    openGraph: {
      title: title || DEFAULT_SEO.siteName,
      description,
      type: ogType,
      locale: locale === "en" ? "en_US" : locale,
      siteName: DEFAULT_SEO.siteName,
      url: canonicalUrl || DEFAULT_SEO.siteUrl,
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title || DEFAULT_SEO.siteName,
          },
        ],
      }),
      ...(ogType === "article" && {
        publishedTime: publishedTime?.toISOString(),
        modifiedTime: modifiedTime?.toISOString(),
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: title || DEFAULT_SEO.siteName,
      description,
      ...(ogImage && { images: [ogImage] }),
      creator: DEFAULT_SEO.twitterHandle,
      site: DEFAULT_SEO.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return metadata;
}

/**
 * Generate article metadata for blog posts
 */
export function generateArticleMetadata(
  post: {
    title: string;
    excerpt?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    featuredImage?: string | null;
    slug: string;
    publishedAt?: Date | null;
    updatedAt?: Date;
    category?: { name: string } | null;
    tags?: { name: string }[];
  },
  locale: SupportedLocale = "en"
): Metadata {
  return generateMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    ogImage: post.featuredImage || undefined,
    ogType: "article",
    canonicalUrl: `${DEFAULT_SEO.siteUrl}/blog/${post.slug}`,
    locale,
    publishedTime: post.publishedAt || undefined,
    modifiedTime: post.updatedAt,
    section: post.category?.name,
    tags: post.tags?.map((t) => t.name),
  });
}

/**
 * Generate event metadata
 */
export function generateEventMetadata(
  event: {
    title: string;
    description?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    bannerImage?: string | null;
    slug: string;
    startDate: Date;
    location?: string | null;
  },
  locale: SupportedLocale = "en"
): Metadata {
  const eventDescription = event.seoDescription || event.description || 
    `Join us for ${event.title} on ${event.startDate.toLocaleDateString()}${event.location ? ` at ${event.location}` : ""}.`;

  return generateMetadata({
    title: event.seoTitle || event.title,
    description: eventDescription,
    ogImage: event.bannerImage || undefined,
    ogType: "website",
    canonicalUrl: `${DEFAULT_SEO.siteUrl}/events/${event.slug}`,
    locale,
  });
}

/**
 * Get global SEO settings from database
 * Uses caching for performance
 */
export async function getGlobalSEOSettings(): Promise<{
  siteName: string;
  siteDescription: string;
  defaultOgImage: string | null;
}> {
  try {
    const settings = await db.siteSettings.findMany({
      where: {
        key: {
          in: ["site-name", "site-description", "default-og-image"],
        },
      },
    });

    const settingsMap = settings.reduce(
      (acc, s) => {
        acc[s.key] = s.value;
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      siteName: settingsMap["site-name"] || DEFAULT_SEO.siteName,
      siteDescription: settingsMap["site-description"] || DEFAULT_SEO.siteDescription,
      defaultOgImage: settingsMap["default-og-image"] || null,
    };
  } catch {
    return {
      siteName: DEFAULT_SEO.siteName,
      siteDescription: DEFAULT_SEO.siteDescription,
      defaultOgImage: null,
    };
  }
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.siteUrl,
    description: DEFAULT_SEO.siteDescription,
    logo: `${DEFAULT_SEO.siteUrl}/logo.png`,
    sameAs: [
      // Social media links will be populated from settings
    ],
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateArticleSchema(post: {
  title: string;
  description?: string;
  slug: string;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.featuredImage || `${DEFAULT_SEO.siteUrl}/og-default.png`,
    url: `${DEFAULT_SEO.siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Organization",
      name: DEFAULT_SEO.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_SEO.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${DEFAULT_SEO.siteUrl}/logo.png`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for an event
 */
export function generateEventSchema(event: {
  title: string;
  description?: string;
  slug: string;
  bannerImage?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.bannerImage || `${DEFAULT_SEO.siteUrl}/og-default.png`,
    url: `${DEFAULT_SEO.siteUrl}/events/${event.slug}`,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: DEFAULT_SEO.siteName,
      url: DEFAULT_SEO.siteUrl,
    },
  };
}
