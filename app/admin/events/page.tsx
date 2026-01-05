import type { Metadata } from "next";
import Link from "next/link";
import { getAllEvents } from "@/features/admin/actions/events";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
} from "@/features/admin/components";
import { DeleteButton, ToggleButton } from "@/features/admin/components/actions";
import { deleteEvent, toggleEventPublished } from "@/features/admin/actions/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Manage events and registrations.",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage events and view registrations."
        action={{ label: "New Event", href: "/admin/events/new" }}
      />

      <DataTable
        data={events.map((event) => ({
          id: event.id,
          title: event.translation?.title || "Untitled",
          slug: event.slug,
          startDate: event.startDate,
          location: event.location || "—",
          isPublished: event.isPublished,
          isFeatured: event.isFeatured,
          allowRegistration: event.allowRegistration,
          registrationClosed: event.registrationClosed,
          registrationCount: event.registrationCount,
          isPast: event.startDate < now,
        }))}
        emptyMessage="No events yet. Create your first event."
        columns={[
          {
            key: "title",
            label: "Event",
            render: (event) => (
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">/{event.slug}</p>
              </div>
            ),
          },
          {
            key: "startDate",
            label: "Date",
            render: (event) => (
              <div className="text-sm">
                <p>{new Date(event.startDate).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ),
          },
          {
            key: "location",
            label: "Location",
          },
          {
            key: "isPublished",
            label: "Status",
            render: (event) => (
              <div className="space-y-1">
                <StatusBadge
                  active={event.isPublished}
                  activeLabel="Published"
                  inactiveLabel="Draft"
                />
                {event.isPast && (
                  <span className="block text-xs text-muted-foreground">Past</span>
                )}
              </div>
            ),
          },
          {
            key: "registrationCount",
            label: "Registrations",
            render: (event) => (
              <div className="text-sm">
                <Link
                  href={`/admin/events/${event.id}/registrations`}
                  className="text-primary hover:underline"
                >
                  {event.registrationCount} registered
                </Link>
                {!event.allowRegistration && (
                  <p className="text-xs text-muted-foreground">Disabled</p>
                )}
                {event.allowRegistration && event.registrationClosed && (
                  <p className="text-xs text-amber-600">Closed</p>
                )}
              </div>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (event) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/events/${event.id}/form`}>
                  <Button size="sm" variant="ghost">
                    Form
                  </Button>
                </Link>
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <ToggleButton
                  id={event.id}
                  isActive={event.isPublished}
                  onToggle={toggleEventPublished}
                />
                <DeleteButton
                  id={event.id}
                  onDelete={deleteEvent}
                  itemName="event"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
