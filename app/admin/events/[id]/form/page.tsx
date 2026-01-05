import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getOrCreateEventForm } from "@/features/admin/actions/form-builder";
import { FormBuilder } from "./_components/form-builder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Form Builder | Admin",
  description: "Build custom registration forms for your event",
};

interface FormBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { id } = await params;

  // Get event with translation
  const event = await db.event.findUnique({
    where: { id },
    include: {
      translations: {
        where: { locale: "en" },
        take: 1,
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Get or create form
  const formResult = await getOrCreateEventForm(id);
  if (!formResult.success || !formResult.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Failed to load form builder. Please try again.
        </div>
      </div>
    );
  }

  const form = formResult.data;
  const eventTitle = event.translations[0]?.title || "Untitled Event";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/admin/events" className="hover:text-foreground">
          Events
        </Link>
        <span>/</span>
        <Link href={`/admin/events/${id}/edit`} className="hover:text-foreground">
          {eventTitle}
        </Link>
        <span>/</span>
        <span className="text-foreground">Form Builder</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Registration Form Builder</h1>
        <p className="text-muted-foreground">
          Customize the registration form for <strong>{eventTitle}</strong>. 
          Add fields, set requirements, and enable the form when ready.
        </p>
      </div>

      {/* Form Builder Component */}
      <FormBuilder
        formId={form.id}
        isActive={form.isActive}
        totalSteps={form.totalSteps}
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
            operator: string;
            value?: string;
          } | null,
          maxFileSize: f.maxFileSize,
          acceptedTypes: f.acceptedTypes,
        }))}
      />

      {/* Quick Links */}
      <div className="mt-8 pt-6 border-t flex gap-4">
        <Link
          href={`/admin/events/${id}/registrations`}
          className="text-sm text-primary hover:underline"
        >
          View Submissions →
        </Link>
        <Link
          href={`/events/${event.slug}`}
          className="text-sm text-primary hover:underline"
          target="_blank"
        >
          Preview Public Page ↗
        </Link>
      </div>
    </div>
  );
}
