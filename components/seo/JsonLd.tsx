import { 
  generateOrganizationSchema, 
  generateArticleSchema, 
  generateEventSchema 
} from "@/lib/seo";

interface JsonLdProps {
  type: "organization" | "article" | "event";
  data?: Record<string, unknown>;
}

/**
 * JSON-LD Structured Data Component
 * 
 * Renders structured data for SEO in script tags
 * Works with server components
 */
export function JsonLd({ type, data }: JsonLdProps) {
  let schema: Record<string, unknown>;

  switch (type) {
    case "organization":
      schema = generateOrganizationSchema();
      break;
    case "article":
      schema = data ? generateArticleSchema(data as Parameters<typeof generateArticleSchema>[0]) : {};
      break;
    case "event":
      schema = data ? generateEventSchema(data as Parameters<typeof generateEventSchema>[0]) : {};
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization JSON-LD - for homepage
 */
export function OrganizationJsonLd() {
  return <JsonLd type="organization" />;
}

/**
 * Article JSON-LD - for blog posts
 */
export function ArticleJsonLd({
  title,
  description,
  slug,
  featuredImage,
  publishedAt,
  updatedAt,
}: {
  title: string;
  description?: string;
  slug: string;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date;
}) {
  return (
    <JsonLd
      type="article"
      data={{
        title,
        description,
        slug,
        featuredImage,
        publishedAt,
        updatedAt,
      }}
    />
  );
}

/**
 * Event JSON-LD - for event pages
 */
export function EventJsonLd({
  title,
  description,
  slug,
  bannerImage,
  startDate,
  endDate,
  location,
}: {
  title: string;
  description?: string;
  slug: string;
  bannerImage?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
}) {
  return (
    <JsonLd
      type="event"
      data={{
        title,
        description,
        slug,
        bannerImage,
        startDate,
        endDate,
        location,
      }}
    />
  );
}
