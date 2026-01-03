import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  Button,
  Badge,
} from "@/components/ui";
import { MotionDiv } from "@/components/ui";

export const dynamic = "force-dynamic";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

async function getProgram(slug: string) {
  return db.program.findFirst({
    where: { slug, isActive: true },
  });
}

async function getRelatedPrograms(currentId: string) {
  return db.program.findMany({
    where: { 
      isActive: true,
      id: { not: currentId },
    },
    orderBy: { order: "asc" },
    take: 3,
  });
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  
  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: `${program.title} | Zionlight Family Foundation`,
    description: program.description,
    openGraph: {
      title: program.title,
      description: program.description,
      images: program.imageUrl ? [program.imageUrl] : [],
    },
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) {
    notFound();
  }

  const relatedPrograms = await getRelatedPrograms(program.id);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <Container className="relative z-10">
          <MotionDiv>
            <Link 
              href="/programs" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Programs
            </Link>
          </MotionDiv>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <MotionDiv>
              {program.isFeatured && (
                <Badge variant="primary" className="mb-4">Featured Program</Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {program.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {program.description}
              </p>
            </MotionDiv>
            
            <MotionDiv delay={0.2}>
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
                {program.imageUrl ? (
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-5xl">✨</span>
                    </div>
                  </div>
                )}
              </div>
            </MotionDiv>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      {program.content && (
        <Section>
          <Container size="sm">
            <MotionDiv>
              <div className="prose prose-lg max-w-none">
                {/* In production, use MDX or rich text renderer */}
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {program.content}
                </div>
              </div>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Get Involved CTA */}
      <Section background="primary">
        <Container className="text-center">
          <MotionDiv>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
              Interested in This Program?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-primary-foreground/80 mb-8">
              Whether you want to participate, volunteer, or learn more—we&apos;d love to hear from you.
            </p>
            <Button 
              href="/contact" 
              className="bg-background text-foreground hover:bg-background/90"
              size="lg"
            >
              Get in Touch
            </Button>
          </MotionDiv>
        </Container>
      </Section>

      {/* Related Programs */}
      {relatedPrograms.length > 0 && (
        <Section>
          <Container>
            <MotionDiv>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Other Programs</h2>
            </MotionDiv>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPrograms.map((related, index) => (
                <MotionDiv key={related.id} delay={index * 0.1}>
                  <Link href={`/programs/${related.slug}`} className="block group">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-muted">
                      {related.imageUrl ? (
                        <Image
                          src={related.imageUrl}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                          <span className="text-2xl">✨</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {related.description}
                    </p>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
