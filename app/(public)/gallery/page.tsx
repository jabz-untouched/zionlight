import type { Metadata } from "next";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  Badge,
} from "@/components/ui";
import { MotionDiv } from "@/components/ui";
import { GalleryGrid } from "./_components/gallery-grid";
import { getPageSectionsByKeys } from "@/features/admin/actions/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | Zionlight Family Foundation",
  description: "See our impact through photos and stories from our community programs and events.",
};

// Default content fallbacks
const defaultContent = {
  hero: {
    title: "Gallery",
    body: "Capturing moments of hope, transformation, and community. Each image tells a story of lives touched and communities strengthened.",
  },
};

async function getGalleryData() {
  const [items, categories, galleryContent] = await Promise.all([
    db.galleryItem.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    }),
    db.galleryItem.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }).then(items => items.map(i => i.category).filter(Boolean) as string[]),
    getPageSectionsByKeys("gallery", ["hero", "intro"]),
  ]);
  
  return { items, categories, galleryContent };
}

export default async function GalleryPage() {
  const { items, categories, galleryContent } = await getGalleryData();
  
  // Extract content with fallbacks
  const heroContent = galleryContent["hero"];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <Container className="relative z-10">
          <MotionDiv className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Our Moments</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {heroContent?.title || defaultContent.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroContent?.body || defaultContent.hero.body}
            </p>
          </MotionDiv>
        </Container>
      </section>

      {/* Gallery Grid */}
      <Section>
        <Container size="lg">
          {items.length > 0 ? (
            <GalleryGrid items={items} categories={categories} />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">📷</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">No Images Yet</h2>
              <p className="text-muted-foreground">
                We&apos;re working on adding photos. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
