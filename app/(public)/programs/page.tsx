import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  Card,
  Badge,
} from "@/components/ui";
import { 
  MotionDiv, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";
import { getPageSectionsByKeys } from "@/features/admin/actions/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Programs | Zionlight Family Foundation",
  description: "Discover our community programs and initiatives making a difference in lives across communities.",
};

// Default content fallbacks
const defaultContent = {
  hero: {
    title: "Our Programs",
    body: "Through our diverse range of programs, we address the most pressing needs of our communities—from education and family support to spiritual growth and community development.",
  },
  cta: {
    title: "Want to Get Involved?",
    body: "Our programs thrive because of people like you. Whether you want to volunteer, partner, or support our work—there's a place for you.",
    ctaText: "Contact Us",
    ctaLink: "/contact",
  },
};

async function getProgramsData() {
  const [programs, programsContent] = await Promise.all([
    db.program.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getPageSectionsByKeys("programs", ["hero", "intro", "cta"]),
  ]);
  
  return { programs, programsContent };
}

export default async function ProgramsPage() {
  const { programs, programsContent } = await getProgramsData();
  
  // Extract content with fallbacks
  const heroContent = programsContent["hero"];
  const ctaContent = programsContent["cta"];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <Container className="relative z-10">
          <MotionDiv className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Our Work</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {heroContent?.title || defaultContent.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroContent?.body || defaultContent.hero.body}
            </p>
          </MotionDiv>
        </Container>
      </section>

      {/* Programs Grid */}
      <Section>
        <Container>
          {programs.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program: typeof programs[0]) => (
                <StaggerItem key={program.id}>
                  <Link href={`/programs/${program.slug}`} className="block h-full">
                    <Card hover className="h-full flex flex-col">
                      <div className="relative h-56 bg-muted">
                        {program.imageUrl ? (
                          <Image
                            src={program.imageUrl}
                            alt={program.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-3xl">✨</span>
                            </div>
                          </div>
                        )}
                        {program.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <Badge variant="primary">Featured</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-xl font-semibold mb-3">{program.title}</h2>
                        <p className="text-muted-foreground flex-1 line-clamp-3">
                          {program.description}
                        </p>
                        <span className="inline-flex items-center mt-4 text-primary font-medium text-sm group">
                          Learn More
                          <svg 
                            className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">No Programs Yet</h2>
              <p className="text-muted-foreground">
                We&apos;re working on exciting new programs. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="muted">
        <Container className="text-center">
          <MotionDiv>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {ctaContent?.title || defaultContent.cta.title}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              {ctaContent?.body || defaultContent.cta.body}
            </p>
            <Link 
              href={ctaContent?.ctaLink || defaultContent.cta.ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              {ctaContent?.ctaText || defaultContent.cta.ctaText}
            </Link>
          </MotionDiv>
        </Container>
      </Section>
    </>
  );
}
