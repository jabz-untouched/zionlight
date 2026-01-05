import type { Metadata } from "next";
import { PageHeader } from "@/features/admin/components";
import { EventForm } from "../_components/event-form";

export const metadata: Metadata = {
  title: "New Event",
  description: "Create a new event.",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Event"
        description="Create a new event with registration."
      />
      <EventForm />
    </div>
  );
}
