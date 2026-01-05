import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section, Container, Card } from "@/components/ui";
import { MotionDiv } from "@/components/ui";
import { EventJsonLd } from "@/components/seo";
import { AnalyticsTracker } from "@/components/analytics";
import { getEventBySlug, getUpcomingEvents } from "@/features/admin/actions/events";
import { DEFAULT_LOCALE } from "@/features/admin/schemas";
import { generateEventMetadata } from "@/lib/seo";
import { RegistrationFormWrapper } from "../_components/registration-form-wrapper";

export const dynamic = "force-dynamic";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug, DEFAULT_LOCALE);

  if (!event || !event.translation) {
    return {
      title: "Event Not Found",
    };
  }

  return generateEventMetadata({
    title: event.translation.title,
    description: event.translation.description,
    seoTitle: event.translation.seoTitle,
    seoDescription: event.translation.seoDescription,
    bannerImage: event.bannerImage,
    slug: event.slug,
    startDate: event.startDate,
    location: event.location,
  });
}

function formatEventDate(startDate: Date, endDate: Date | null): string {
  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  
  if (!endDate) {
    return start.toLocaleDateString("en-US", options);
  }
  
  const end = new Date(endDate);
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-US", options);
  }
  
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

function formatEventTime(startDate: Date, endDate: Date | null): string {
  const start = new Date(startDate);
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (!endDate) {
    return startTime;
  }

  const end = new Date(endDate);
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug, DEFAULT_LOCALE);

  if (!event || !event.translation) {
    notFound();
  }

  const now = new Date();
  const isPast = event.startDate < now;
  const spotsLeft = event.maxAttendees 
    ? event.maxAttendees - event.registrationCount 
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const canRegister = event.allowRegistration && !event.registrationClosed && !isFull && !isPast;

  // Get other upcoming events
  const upcomingEvents = await getUpcomingEvents(DEFAULT_LOCALE, 3);
  const otherEvents = upcomingEvents.filter((e) => e.id !== event.id).slice(0, 2);

  return (
    <>
      {/* Structured Data */}
      <EventJsonLd
        title={event.translation.title}
        description={event.translation.description}
        slug={event.slug}
        bannerImage={event.bannerImage}
        startDate={event.startDate}
        endDate={event.endDate}
        location={event.location}
      />
      
      {/* Analytics tracking */}
      <AnalyticsTracker
        type="event"
        slug={event.slug}
        title={event.translation.title}
        isUpcoming={!isPast}
      />

      {/* Hero */}
      <Section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
        <Container>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/events"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Events
            </Link>

            {isPast && (
              <span className="mb-4 inline-block rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700">
                Past Event
              </span>
            )}

            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {event.translation.title}
            </h1>

            {/* Event meta */}
            <div className="mt-6 flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>{formatEventDate(event.startDate, event.endDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{formatEventTime(event.startDate, event.endDate)}</span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.locationUrl ? (
                    <a
                      href={event.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {event.location}
                    </a>
                  ) : (
                    <span>{event.location}</span>
                  )}
                </div>
              )}
            </div>
          </MotionDiv>
        </Container>
      </Section>

      {/* Banner Image */}
      {event.bannerImage && (
        <Section className="py-0">
          <Container className="max-w-5xl">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-video overflow-hidden rounded-xl"
            >
              <Image
                src={event.bannerImage}
                alt={event.translation.title}
                fill
                className="object-cover"
                priority
              />
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Content & Registration */}
      <Section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="mb-4 text-xl font-semibold">About This Event</h2>
                <div
                  className="prose prose-lg dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: formatContent(event.translation.description),
                  }}
                />
              </MotionDiv>
            </div>

            {/* Sidebar - Registration */}
            <div className="lg:col-span-1">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sticky top-24"
              >
                {canRegister ? (
                  <RegistrationFormWrapper
                    eventId={event.id}
                    eventSlug={event.slug}
                    eventTitle={event.translation.title}
                    maxAttendees={event.maxAttendees}
                    registrationCount={event.registrationCount}
                  />
                ) : (
                  <Card className="p-6">
                    {isPast && (
                      <div className="text-center">
                        <p className="text-lg font-medium text-muted-foreground">
                          This event has ended
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Check out our other upcoming events.
                        </p>
                      </div>
                    )}
                    {!isPast && isFull && (
                      <div className="text-center">
                        <p className="text-lg font-medium text-destructive">
                          Event is Full
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This event has reached maximum capacity.
                        </p>
                      </div>
                    )}
                    {!isPast && !isFull && event.registrationClosed && (
                      <div className="text-center">
                        <p className="text-lg font-medium text-muted-foreground">
                          Registration Closed
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Registration for this event is no longer available.
                        </p>
                      </div>
                    )}
                    {!isPast && !event.allowRegistration && (
                      <div className="text-center">
                        <p className="text-lg font-medium">
                          No Registration Required
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This is an open event. Just show up!
                        </p>
                      </div>
                    )}
                  </Card>
                )}

                {/* Event details summary */}
                <Card className="mt-6 p-6">
                  <h3 className="mb-4 font-semibold">Event Details</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Date</dt>
                      <dd className="font-medium">
                        {formatEventDate(event.startDate, event.endDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Time</dt>
                      <dd className="font-medium">
                        {formatEventTime(event.startDate, event.endDate)}
                      </dd>
                    </div>
                    {event.location && (
                      <div>
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="font-medium">{event.location}</dd>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div>
                        <dt className="text-muted-foreground">Capacity</dt>
                        <dd className="font-medium">
                          {event.registrationCount} / {event.maxAttendees} registered
                        </dd>
                      </div>
                    )}
                  </dl>
                </Card>
              </MotionDiv>
            </div>
          </div>
        </Container>
      </Section>

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <Section className="border-t bg-muted/30 py-16">
          <Container>
            <h2 className="mb-8 text-center text-2xl font-bold">
              Other Upcoming Events
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {otherEvents.map((otherEvent) => (
                <Link key={otherEvent.id} href={`/events/${otherEvent.slug}`}>
                  <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="flex">
                      {otherEvent.bannerImage && (
                        <div className="relative h-32 w-32 flex-shrink-0">
                          <Image
                            src={otherEvent.bannerImage}
                            alt={otherEvent.translation?.title || "Event"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <h3 className="font-semibold transition-colors group-hover:text-primary">
                          {otherEvent.translation?.title || "Untitled Event"}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(otherEvent.startDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {otherEvent.location && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {otherEvent.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

// Simple content formatter
function formatContent(content: string): string {
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
