import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  SectionHeader, 
  Button, 
  Card,
  CountdownTimer,
} from "@/components/ui";
import { 
  MotionSection, 
  MotionDiv, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";
import {
  HeroSection,
  getGlobalFallbackImage,
  getManagedImagesByContext,
} from "@/components/media";
import { getPageSectionsByKeys } from "@/features/admin/actions/content";
import { QuoteBlock, StatsGrid } from "@/components/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zionlight Family Foundation | Empowering Communities Through Faith",
  description: "Zionlight Family Foundation is dedicated to empowering communities through faith, love, and dedicated service. Building bridges of hope for a brighter tomorrow.",
};

// Default content fallbacks
const defaultContent = {
  hero: {
    badge: "Empowering Communities Since 2010",
    title: "Building Bridges of Hope & Faith",
    body: "Zionlight Family Foundation is dedicated to transforming lives through compassionate outreach, educational programs, and community empowerment.",
  },
  mission: {
    quote: "To serve with love, uplift with faith, and empower with action—creating lasting change in the lives we touch.",
    attribution: "Our Guiding Mission",
  },
  cta: {
    title: "Ready to Make a Difference?",
    body: "Join us in our mission to build stronger communities. Whether through volunteering, partnerships, or simply spreading the word—every action counts.",
    ctaText: "Get in Touch",
    ctaLink: "/contact",
  },
  stats: [
    { number: "15+", label: "Years of Service" },
    { number: "5,000+", label: "Lives Touched" },
    { number: "25+", label: "Programs Run" },
    { number: "100+", label: "Volunteers" },
  ],
};

async function getFeaturedContent() {
  const [programs, teamMembers, homeImages, globalFallback, homeContent, blogPosts, events] = await Promise.all([
    db.program.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.teamMember.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: 4,
    }),
    getManagedImagesByContext("HOME"),
    getGlobalFallbackImage(),
    getPageSectionsByKeys("home", ["hero", "mission-preview", "programs-intro", "cta", "stats"]),
    // Featured blog posts
    db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: {
        translations: {
          where: { locale: "en" },
          take: 1,
        },
        category: true,
      },
    }),
    // Upcoming events
    db.event.findMany({
      where: { 
        isPublished: true,
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 3,
      include: {
        translations: {
          where: { locale: "en" },
          take: 1,
        },
        _count: {
          select: { registrations: true },
        },
      },
    }),
  ]);

  return { programs, teamMembers, homeImages, globalFallback, homeContent, blogPosts, events };
}

export default async function HomePage() {
  const { programs, teamMembers, globalFallback, homeContent, blogPosts, events } = await getFeaturedContent();
  
  const fallbackImageUrl = globalFallback?.imageUrl;
  
  // Extract content with fallbacks
  const heroContent = homeContent["hero"];
  const missionContent = homeContent["mission-preview"];
  const ctaContent = homeContent["cta"];
  const statsContent = homeContent["stats"];
  
  // Parse stats from metadata or use defaults
  let stats = defaultContent.stats;
  if (statsContent?.metadata) {
    try {
      const parsed = typeof statsContent.metadata === "string" 
        ? JSON.parse(statsContent.metadata) 
        : statsContent.metadata;
      if (Array.isArray(parsed.stats)) {
        stats = parsed.stats;
      }
    } catch {
      // Use defaults
    }
  }

  return (
    <>
      {/* Hero Section with Dynamic Image */}
      <HeroSection overlayOpacity={0.4}>
        <Container className="py-12 sm:py-16 md:py-20">
          <MotionDiv variant="fadeInUp">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
              {heroContent?.subtitle || defaultContent.hero.badge}
            </span>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
              {heroContent?.title ? (
                heroContent.title.includes("|") ? (
                  <>
                    {heroContent.title.split("|")[0]?.trim()}
                    <span className="block text-primary mt-1 sm:mt-2">
                      {heroContent.title.split("|")[1]?.trim()}
                    </span>
                  </>
                ) : (
                  heroContent.title
                )
              ) : (
                <>
                  Building Bridges of
                  <span className="block text-primary mt-1 sm:mt-2">Hope & Faith</span>
                </>
              )}
            </h1>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.2}>
            <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              {heroContent?.body || defaultContent.hero.body}
            </p>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.3} className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button href="/programs" size="lg" fullWidthMobile>
              Explore Our Programs
            </Button>
            <Button href="/about" variant="outline" size="lg" fullWidthMobile>
              Learn About Us
            </Button>
          </MotionDiv>
        </Container>
      </HeroSection>

      {/* Event Countdown Timer */}
      {events.length > 0 && events[0] && (
        <Section className="py-12">
          <Container className="max-w-3xl">
            <MotionDiv variant="fadeInUp">
              <CountdownTimer
                targetDate={events[0].startDate}
                eventTitle={events[0].translations[0]?.title || "Upcoming Event"}
                eventSlug={events[0].slug}
                backgroundImage={events[0].bannerImage}
              />
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Mission Statement */}
      <MotionSection className="py-20 bg-muted/30">
        <Container>
          <QuoteBlock
            content={missionContent ?? null}
            fallbackQuote={defaultContent.mission.quote}
            fallbackAttribution={defaultContent.mission.attribution}
          />
        </Container>
      </MotionSection>

      {/* Featured Programs */}
      {programs.length > 0 && (
        <Section>
          <Container>
            <MotionDiv>
              <SectionHeader
                subtitle="What We Do"
                title="Our Programs"
                description="Discover how we're making a difference in communities through our dedicated programs and initiatives."
              />
            </MotionDiv>

            <StaggerContainer className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <StaggerItem key={program.id}>
                  <Link href={`/programs/${program.slug}`}>
                    <Card hover className="h-full">
                      <div className="relative h-44 sm:h-48 bg-muted">
                        {(program.imageUrl || fallbackImageUrl) ? (
                          <Image
                            src={program.imageUrl || fallbackImageUrl!}
                            alt={program.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xl sm:text-2xl">🌟</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">{program.title}</h3>
                        <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">
                          {program.description}
                        </p>
                        <span className="inline-flex items-center mt-4 text-primary font-medium text-sm min-h-[44px]">
                          Learn More
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <MotionDiv className="mt-8 sm:mt-12 text-center">
              <Button href="/programs" variant="outline">
                View All Programs
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Latest Blog Posts */}
      {blogPosts.length > 0 && (
        <Section className="bg-muted/30">
          <Container>
            <MotionDiv>
              <SectionHeader
                subtitle="From Our Blog"
                title="Latest Updates"
                description="Stay informed with the latest news, stories, and insights from our community."
              />
            </MotionDiv>

            <StaggerContainer className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => {
                const translation = post.translations[0];
                if (!translation) return null;
                
                return (
                  <StaggerItem key={post.id}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card hover className="h-full flex flex-col">
                        <div className="relative h-44 sm:h-48 bg-muted">
                          {(post.featuredImage || fallbackImageUrl) ? (
                            <Image
                              src={post.featuredImage || fallbackImageUrl!}
                              alt={translation.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xl sm:text-2xl">📝</span>
                              </div>
                            </div>
                          )}
                          {post.category && (
                            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                              {post.category.name}
                            </span>
                          )}
                        </div>
                        <div className="p-5 sm:p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                            <time dateTime={post.publishedAt?.toISOString()}>
                              {post.publishedAt?.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                            {translation.title}
                          </h3>
                          {translation.excerpt && (
                            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 flex-1">
                              {translation.excerpt}
                            </p>
                          )}
                          <span className="inline-flex items-center mt-4 text-primary font-medium text-sm min-h-[44px]">
                            Read More
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <MotionDiv className="mt-8 sm:mt-12 text-center">
              <Button href="/blog" variant="outline">
                View All Posts
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <Section>
          <Container>
            <MotionDiv>
              <SectionHeader
                subtitle="Join Us"
                title="Upcoming Events"
                description="Be part of our community gatherings, workshops, and special events."
              />
            </MotionDiv>

            <StaggerContainer className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const translation = event.translations[0];
                if (!translation) return null;
                
                const isRegistrationOpen = event.allowRegistration && 
                  !event.registrationClosed && 
                  (!event.maxAttendees || event._count.registrations < event.maxAttendees);
                
                return (
                  <StaggerItem key={event.id}>
                    <Link href={`/events/${event.slug}`}>
                      <Card hover className="h-full flex flex-col">
                        <div className="relative h-44 sm:h-48 bg-muted">
                          {(event.bannerImage || fallbackImageUrl) ? (
                            <Image
                              src={event.bannerImage || fallbackImageUrl!}
                              alt={translation.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <span className="text-xl sm:text-2xl">📅</span>
                              </div>
                            </div>
                          )}
                          {isRegistrationOpen && (
                            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 sm:px-3 bg-green-500 text-white text-xs font-medium rounded-full">
                              Registration Open
                            </span>
                          )}
                        </div>
                        <div className="p-5 sm:p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={event.startDate.toISOString()}>
                              {event.startDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                            {translation.title}
                          </h3>
                          {event.location && (
                            <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 mb-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="line-clamp-1">{event.location}</span>
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 flex-1">
                            {translation.description}
                          </p>
                          <span className="inline-flex items-center mt-4 text-primary font-medium text-sm min-h-[44px]">
                            View Details
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <MotionDiv className="mt-8 sm:mt-12 text-center">
              <Button href="/events" variant="outline">
                View All Events
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Impact Stats */}
      <MotionSection className="py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground">
        <Container>
          <StatsGrid stats={stats} />
        </Container>
      </MotionSection>

      {/* Featured Team */}
      {teamMembers.length > 0 && (
        <Section>
          <Container>
            <MotionDiv>
              <SectionHeader
                subtitle="Our Team"
                title="Meet Our Leaders"
                description="Dedicated individuals working together to make our vision a reality."
              />
            </MotionDiv>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {teamMembers.map((member) => (
                <StaggerItem key={member.id}>
                  <div className="text-center group">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-muted">
                      {(member.imageUrl || fallbackImageUrl) ? (
                        <Image
                          src={member.imageUrl || fallbackImageUrl!}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-primary">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">{member.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{member.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <MotionDiv className="mt-8 sm:mt-12 text-center">
              <Button href="/about#team" variant="outline">
                Meet the Full Team
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Call to Action */}
      <MotionSection className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
        <Container className="text-center">
          <MotionDiv>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              {ctaContent?.title || defaultContent.cta.title}
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-secondary-foreground/80 mb-8 sm:mb-10">
              {ctaContent?.body || defaultContent.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button 
                href={ctaContent?.ctaLink || defaultContent.cta.ctaLink} 
                className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90"
                size="lg"
                fullWidthMobile
              >
                {ctaContent?.ctaText || defaultContent.cta.ctaText}
              </Button>
              <Button 
                href="/about" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                size="lg"
                fullWidthMobile
              >
                Learn More
              </Button>
            </div>
          </MotionDiv>
        </Container>
      </MotionSection>
    </>
  );
}
