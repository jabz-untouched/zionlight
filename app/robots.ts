import type { MetadataRoute } from "next";
import { DEFAULT_SEO } from "@/lib/seo";

/**
 * Dynamic robots.txt generation
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = DEFAULT_SEO.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/_next/",
          "/private/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
