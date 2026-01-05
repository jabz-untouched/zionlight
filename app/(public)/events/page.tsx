import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Section, 
  Container, 
  SectionHeader, 
  Card 
} from "@/components/ui";
import { 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";
import { getUpcomingEvents, getPastEvents } from "@/features/admin/actions/events";
import { DEFAULT_LOCALE } from "@/features/admin/schemas";
import { generateMetadata as generateSEO, DEFAULT_SEO } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generateSEO({
  title: "Events",
  description: "Join us at upcoming community events, fundraisers, and outreach programs.",
  canonicalUrl: `${DEFAULT_SEO.siteUrl}/events`,
});

function formatEventTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    startDate: Date;
    endDate: Date | null;
    location: string | null;
    bannerImage: string | null;
    allowRegistration: boolean;
    registrationClosed: boolean;
    maxAttendees: number | null;
    translation?: {
      title: string;
      description: string;
    } | null;
    registrationCount: number;
  };
  isPast?: boolean;
}

function EventCard({ event, isPast = false }: EventCardProps) {
  const spotsLeft = event.maxAttendees 
    ? event.maxAttendees - event.registrationCount 
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const canRegister = event.allowRegistration && !event.registrationClosed && !isFull && !isPast;

  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        {event.bannerImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={event.bannerImage}
              alt={event.translation?.title || "Event"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isPast && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800">
                  Past Event
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-6">
          {/* Date badge */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-xs font-medium uppercase">
                {new Date(event.startDate).toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="text-xl font-bold">
                {new Date(event.startDate).getDate()}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{formatEventTime(event.startDate)}</p>
              {event.location && <p className="truncate">{event.location}</p>}
            </div>
          </div>

          <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
            {event.translation?.title || "Untitled Event"}
          </h2>

          {event.translation?.description && (
            <p className="mb-4 line-clamp-2 text-muted-foreground">
              {event.translation.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {canRegister && (
              <span className="text-sm font-medium text-primary">
                Register Now →
              </span>
            )}
            {!isPast && event.allowRegistration && isFull && (
              <span className="text-sm font-medium text-destructive">
                Event Full
              </span>
            )}
            {!isPast && event.allowRegistration && event.registrationClosed && !isFull && (
              <span className="text-sm text-muted-foreground">
                Registration Closed
              </span>
            )}
            {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
              <span className="text-sm text-amber-600">
                Only {spotsLeft} spots left
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(DEFAULT_LOCALE),
    getPastEvents(DEFAULT_LOCALE, 6),
  ]);

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <Container>
          <SectionHeader
            title="Events"
            description="Join us at upcoming community events, fundraisers, and outreach programs"
            align="center"
          />
        </Container>
      </Section>

      {/* Upcoming Events */}
      <Section className="py-16">
        <Container>
          <h2 className="mb-8 text-2xl font-bold">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </Container>
      </Section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Section className="border-t bg-muted/30 py-16">
          <Container>
            <h2 className="mb-8 text-2xl font-bold">Past Events</h2>
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} isPast />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </Section>
      )}
    </>
  );
}
