import { db } from "@/lib/db";
import { DynamicRegistrationForm } from "./dynamic-registration-form";
import { EventRegistrationForm } from "./event-registration-form";

interface RegistrationFormWrapperProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  maxAttendees: number | null;
  registrationCount: number;
}

export async function RegistrationFormWrapper({
  eventId,
  eventSlug,
  eventTitle,
  maxAttendees,
  registrationCount,
}: RegistrationFormWrapperProps) {
  // Try to get the dynamic form
  const form = await db.eventRegistrationForm.findUnique({
    where: { eventId },
    include: {
      fields: {
        orderBy: { order: "asc" },
      },
    },
  });

  // Get submission count for dynamic forms
  const submissionCount = form
    ? await db.eventFormSubmission.count({ where: { eventId } })
    : 0;

  // If there's an active dynamic form with fields, use it
  if (form && form.isActive && form.fields.length > 0) {
    return (
      <DynamicRegistrationForm
        eventId={eventId}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        formId={form.id}
        fields={form.fields.map((f) => ({
          id: f.id,
          label: f.label,
          placeholder: f.placeholder,
          fieldType: f.fieldType,
          options: f.options as string[] | null,
          isRequired: f.isRequired,
          order: f.order,
          step: f.step,
          conditionalLogic: f.conditionalLogic as {
            dependsOnFieldId: string;
            operator: "equals" | "not_equals" | "contains" | "is_checked";
            value?: string;
          } | null,
          maxFileSize: f.maxFileSize,
          acceptedTypes: f.acceptedTypes,
        }))}
        totalSteps={form.totalSteps}
        maxAttendees={maxAttendees}
        submissionCount={submissionCount}
      />
    );
  }

  // Fall back to legacy form
  return (
    <EventRegistrationForm
      eventId={eventId}
      eventSlug={eventSlug}
      eventTitle={eventTitle}
      maxAttendees={maxAttendees}
      registrationCount={registrationCount}
    />
  );
}
