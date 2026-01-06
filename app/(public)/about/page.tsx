import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  SectionHeader, 
  Button, 
  Card,
  Badge,
} from "@/components/ui";
import { 
  MotionSection, 
  MotionDiv, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";
import { getPageSectionsByKeys } from "@/features/admin/actions/content";
import { getManagedImage } from "@/components/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Zionlight Family Foundation",
  description: "Learn about our mission, vision, values, and the dedicated team behind Zionlight Family Foundation.",
};

// Default content fallbacks
const defaultContent = {
  hero: {
    title: "Who We Are",
    body: "Zionlight Family Foundation is a faith-based non-profit organization committed to transforming communities through compassion, service, and unwavering dedication to human dignity.",
  },
  story: {
    title: "Our Story",
    body: `Founded in 2010, Zionlight Family Foundation emerged from a simple yet powerful vision: to be a beacon of hope for families and communities in need. What began as a small group of dedicated volunteers has grown into a thriving organization touching thousands of lives.

Our journey has been marked by countless stories of transformation—children receiving education, families finding stability, and communities discovering their collective strength. Each milestone reinforces our commitment to serving with love and integrity.

Today, we continue to expand our reach while staying true to our founding principles: faith, family, and community service.`,
  },
  vision: {
    title: "Our Vision",
    body: "To see every family empowered, every community thriving, and every individual realizing their God-given potential. We envision a world where love transcends barriers and hope illuminates the darkest corners.",
  },
  mission: {
    title: "Our Mission",
    body: "To serve with love, uplift with faith, and empower with action—creating lasting change through educational initiatives, community programs, and spiritual support that honor the dignity of every person we serve.",
  },
  hemer: [
    { letter: "H", word: "Humility", description: "Serving others with a humble heart" },
    { letter: "E", word: "Excellence", description: "Striving for the highest standards" },
    { letter: "M", word: "Mercy", description: "Extending grace and compassion" },
    { letter: "E", word: "Empowerment", description: "Building capacity in communities" },
    { letter: "R", word: "Resilience", description: "Persevering through challenges" },
  ],
  cta: {
    title: "Join Our Journey",
    body: "Whether you want to volunteer, partner with us, or simply learn more about our work, we'd love to connect with you.",
    ctaText: "Get in Touch",
    ctaLink: "/contact",
  },
};

async function getAboutData() {
  const [teamMembers, aboutContent, storyImage] = await Promise.all([
    db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getPageSectionsByKeys("about", [
      "hero", 
      "story", 
      "vision", 
      "mission", 
      "hemer-values",
      "director-message",
      "cta"
    ]),
    getManagedImage("about-story"),
  ]);
  
  return { teamMembers, aboutContent, storyImage };
}

export default async function AboutPage() {
  const { teamMembers, aboutContent, storyImage } = await getAboutData();
  
  // Extract content with fallbacks
  const heroContent = aboutContent["hero"];
  const storyContent = aboutContent["story"];
  const visionContent = aboutContent["vision"];
  const missionContent = aboutContent["mission"];
  const hemerContent = aboutContent["hemer-values"];
  const ctaContent = aboutContent["cta"];
  
  // Parse HEMER values from metadata or use defaults
  let hemerValues = defaultContent.hemer;
  if (hemerContent?.metadata) {
    try {
      const parsed = typeof hemerContent.metadata === "string"
        ? JSON.parse(hemerContent.metadata)
        : hemerContent.metadata;
      if (Array.isArray(parsed.values)) {
        hemerValues = parsed.values;
      }
    } catch {
      // Use defaults
    }
  }
  
  // Find director (if marked as featured or first member)
  const director = teamMembers.find((m: typeof teamMembers[0]) => m.role.toLowerCase().includes("director")) || teamMembers[0];
  const otherMembers = teamMembers.filter((m: typeof teamMembers[0]) => m.id !== director?.id);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <Container className="relative z-10">
          <MotionDiv className="max-w-3xl">
            <Badge variant="primary" className="mb-3 sm:mb-4">About Us</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              {heroContent?.title || defaultContent.hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              {heroContent?.body || defaultContent.hero.body}
            </p>
          </MotionDiv>
        </Container>
      </section>

      {/* Our Story */}
      <Section background="muted">
        <Container>
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            <MotionDiv className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                {storyContent?.title || defaultContent.story.title}
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {(storyContent?.body || defaultContent.story.body).split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </MotionDiv>
            <MotionDiv delay={0.2} className="order-1 lg:order-2">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {storyImage?.imageUrl ? (
                  <Image
                    src={storyImage.imageUrl}
                    alt={storyImage.altText || "Our Story"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6 sm:p-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl md:text-4xl">🌟</span>
                      </div>
                      <p className="text-base sm:text-lg font-medium">Serving Since 2010</p>
                    </div>
                  </div>
                )}
              </div>
            </MotionDiv>
          </div>
        </Container>
      </Section>

      {/* Vision & Mission */}
      <Section>
        <Container>
          <MotionDiv>
            <SectionHeader
              subtitle="Our Purpose"
              title="Vision & Mission"
            />
          </MotionDiv>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <MotionDiv>
              <Card className="h-full p-5 sm:p-6 md:p-8 bg-primary/5 border-primary/20">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {visionContent?.title || defaultContent.vision.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {visionContent?.body || defaultContent.vision.body}
                </p>
              </Card>
            </MotionDiv>

            <MotionDiv delay={0.1}>
              <Card className="h-full p-5 sm:p-6 md:p-8 bg-secondary/5 border-secondary/20">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {missionContent?.title || defaultContent.mission.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {missionContent?.body || defaultContent.mission.body}
                </p>
              </Card>
            </MotionDiv>
          </div>
        </Container>
      </Section>

      {/* HEMER Values */}
      <Section background="muted" id="hemer">
        <Container>
          <MotionDiv>
            <SectionHeader
              subtitle={hemerContent?.subtitle || "Our Values"}
              title={hemerContent?.title || "The HEMER Principles"}
              description="Five core values that guide everything we do"
            />
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {hemerValues.map((value) => (
              <StaggerItem key={value.letter}>
                <Card className="p-4 sm:p-6 text-center h-full">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{value.letter}</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{value.word}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Director Section */}
      {director && (
        <Section id="director">
          <Container>
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
              <MotionDiv className="order-2 lg:order-1">
                <Badge variant="primary" className="mb-3 sm:mb-4">Leadership</Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Meet Our Director
                </h2>
                <h3 className="text-lg sm:text-xl text-primary font-medium mb-1 sm:mb-2">{director.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{director.role}</p>
                {director.bio && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                    {director.bio}
                  </p>
                )}
                <div className="flex gap-3">
                  {director.email && (
                    <a 
                      href={`mailto:${director.email}`}
                      className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all touch-action-manipulation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                  {director.linkedIn && (
                    <a 
                      href={director.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all touch-action-manipulation"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </MotionDiv>
              <MotionDiv delay={0.2} className="order-1 lg:order-2">
                <div className="relative h-64 sm:h-80 md:h-[450px] rounded-xl sm:rounded-2xl overflow-hidden">
                  {director.imageUrl ? (
                    <Image
                      src={director.imageUrl}
                      alt={director.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary/50">
                        {director.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </MotionDiv>
            </div>
          </Container>
        </Section>
      )}

      {/* Team Section */}
      {otherMembers.length > 0 && (
        <Section background="muted" id="team">
          <Container>
            <MotionDiv>
              <SectionHeader
                subtitle="Our Team"
                title="Meet the People Behind Our Mission"
                description="A dedicated team of professionals and volunteers working together to create positive change."
              />
            </MotionDiv>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {otherMembers.map((member: typeof teamMembers[0]) => (
                <StaggerItem key={member.id}>
                  <Card hover className="overflow-hidden">
                    <div className="relative h-36 sm:h-48 lg:h-56 bg-muted">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/30">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg">{member.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{member.role}</p>
                      {member.bio && (
                        <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2">
                          {member.bio}
                        </p>
                      )}
                      {(member.email || member.linkedIn) && (
                        <div className="flex gap-2 mt-3 sm:mt-4">
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`}
                              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-primary active:scale-95 transition-all touch-action-manipulation"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedIn && (
                            <a 
                              href={member.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-primary active:scale-95 transition-all touch-action-manipulation"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <MotionSection className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <Container className="text-center px-4 sm:px-6">
          <MotionDiv>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              {ctaContent?.title || defaultContent.cta.title}
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-primary-foreground/80 mb-6 sm:mb-8">
              {ctaContent?.body || defaultContent.cta.body}
            </p>
            <Button 
              href={ctaContent?.ctaLink || defaultContent.cta.ctaLink} 
              className="bg-background text-foreground hover:bg-background/90 w-full sm:w-auto"
              size="lg"
            >
              {ctaContent?.ctaText || defaultContent.cta.ctaText}
            </Button>
          </MotionDiv>
        </Container>
      </MotionSection>
    </>
  );
}
