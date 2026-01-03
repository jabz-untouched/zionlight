import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { 
  Section, 
  Container, 
  SectionHeader, 
  Button, 
  Card 
} from "@/components/ui";
import { 
  MotionSection, 
  MotionDiv, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zionlight Family Foundation | Empowering Communities Through Faith",
  description: "Zionlight Family Foundation is dedicated to empowering communities through faith, love, and dedicated service. Building bridges of hope for a brighter tomorrow.",
};

async function getFeaturedContent() {
  const [programs, teamMembers] = await Promise.all([
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
  ]);

  return { programs, teamMembers };
}

export default async function HomePage() {
  const { programs, teamMembers } = await getFeaturedContent();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <Container className="relative z-10 text-center py-20">
          <MotionDiv variant="fadeInUp">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Empowering Communities Since 2010
            </span>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Building Bridges of
              <span className="block text-primary">Hope & Faith</span>
            </h1>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.2}>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Zionlight Family Foundation is dedicated to transforming lives through 
              compassionate outreach, educational programs, and community empowerment.
            </p>
          </MotionDiv>
          
          <MotionDiv variant="fadeInUp" delay={0.3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/programs" size="lg">
              Explore Our Programs
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Learn About Us
            </Button>
          </MotionDiv>
        </Container>
      </section>

      {/* Mission Statement */}
      <MotionSection className="py-20 bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <MotionDiv>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-foreground/90">
                &ldquo;To serve with love, uplift with faith, and empower with action—
                <span className="text-primary"> creating lasting change</span> in the lives we touch.&rdquo;
              </blockquote>
              <cite className="mt-6 block text-muted-foreground font-medium">
                — Our Guiding Mission
              </cite>
            </MotionDiv>
          </div>
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

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <StaggerItem key={program.id}>
                  <Link href={`/programs/${program.slug}`}>
                    <Card hover className="h-full">
                      {program.imageUrl && (
                        <div className="relative h-48 bg-muted">
                          <Image
                            src={program.imageUrl}
                            alt={program.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {!program.imageUrl && (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-2xl">🌟</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">
                          {program.description}
                        </p>
                        <span className="inline-flex items-center mt-4 text-primary font-medium text-sm">
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

            <MotionDiv className="mt-12 text-center">
              <Button href="/programs" variant="outline">
                View All Programs
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Impact Stats */}
      <MotionSection className="py-20 bg-primary text-primary-foreground">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years of Service" },
              { number: "5,000+", label: "Lives Touched" },
              { number: "25+", label: "Programs Run" },
              { number: "100+", label: "Volunteers" },
            ].map((stat, index) => (
              <MotionDiv key={stat.label} delay={index * 0.1}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </MotionDiv>
            ))}
          </div>
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

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <StaggerItem key={member.id}>
                  <div className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <MotionDiv className="mt-12 text-center">
              <Button href="/about#team" variant="outline">
                Meet the Full Team
              </Button>
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Call to Action */}
      <MotionSection className="py-24 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
        <Container className="text-center">
          <MotionDiv>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-secondary-foreground/80 mb-10">
              Join us in our mission to build stronger communities. Whether through 
              volunteering, partnerships, or simply spreading the word—every action counts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                href="/contact" 
                className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90"
                size="lg"
              >
                Get in Touch
              </Button>
              <Button 
                href="/about" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                size="lg"
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
