import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/features/admin/actions/events";
import { PageHeader } from "@/features/admin/components";
import { EventForm } from "../../_components/event-form";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Edit event details.",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Event"
        description={`Editing: ${event.translation?.title || event.slug}`}
      />
      <EventForm event={event} />
    </div>
  );
}
