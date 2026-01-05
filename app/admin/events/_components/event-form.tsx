"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventWithTranslationSchema,
  type EventWithTranslationFormData,
  DEFAULT_LOCALE,
} from "@/features/admin/schemas";
import {
  Card,
  FormField,
  Input,
  Textarea,
  Checkbox,
  Button,
} from "@/features/admin/components";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { createEvent, updateEvent } from "@/features/admin/actions/events";
import type { Event, EventTranslation } from "@prisma/client";

interface EventFormProps {
  event?: Event & {
    translations: EventTranslation[];
  };
}

function formatDateTimeLocal(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  // Get the default locale translation
  const translation = event?.translations.find((t) => t.locale === DEFAULT_LOCALE);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventWithTranslationFormData>({
    resolver: zodResolver(eventWithTranslationSchema),
    defaultValues: {
      slug: event?.slug || "",
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || undefined,
      location: event?.location || "",
      locationUrl: event?.locationUrl || "",
      bannerImage: event?.bannerImage || "",
      isPublished: event?.isPublished ?? false,
      isFeatured: event?.isFeatured ?? false,
      allowRegistration: event?.allowRegistration ?? true,
      registrationClosed: event?.registrationClosed ?? false,
      maxAttendees: event?.maxAttendees || undefined,
      translation: {
        locale: DEFAULT_LOCALE,
        title: translation?.title || "",
        description: translation?.description || "",
        seoTitle: translation?.seoTitle || "",
        seoDescription: translation?.seoDescription || "",
      },
    },
  });

  const bannerImage = watch("bannerImage");

  const onSubmit = async (data: EventWithTranslationFormData) => {
    const result = isEditing
      ? await updateEvent(event.id, data)
      : await createEvent(data);

    if (result.success) {
      router.push("/admin/events");
      router.refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("translation.title", title);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Event Details</h2>
        <div className="space-y-4">
          <FormField
            label="Title"
            error={errors.translation?.title?.message}
            required
          >
            <Input
              value={watch("translation.title")}
              onChange={handleTitleChange}
              error={!!errors.translation?.title}
              placeholder="Annual Fundraising Gala"
            />
          </FormField>

          <FormField label="Slug" error={errors.slug?.message} required>
            <Input
              {...register("slug")}
              error={!!errors.slug}
              placeholder="annual-fundraising-gala"
            />
          </FormField>

          <FormField
            label="Description"
            error={errors.translation?.description?.message}
            required
          >
            <Textarea
              {...register("translation.description")}
              error={!!errors.translation?.description}
              placeholder="Full event description..."
              rows={8}
            />
          </FormField>

          <FormField label="Banner Image" error={errors.bannerImage?.message}>
            <ImageUpload
              value={bannerImage}
              onChange={(url) => setValue("bannerImage", url)}
              placeholder="https://example.com/event-banner.jpg"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Date & Location</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Start Date & Time"
              error={errors.startDate?.message}
              required
            >
              <Input
                type="datetime-local"
                defaultValue={formatDateTimeLocal(event?.startDate || null)}
                onChange={(e) => {
                  if (e.target.value) {
                    setValue("startDate", new Date(e.target.value));
                  }
                }}
                error={!!errors.startDate}
              />
            </FormField>

            <FormField label="End Date & Time" error={errors.endDate?.message}>
              <Input
                type="datetime-local"
                defaultValue={formatDateTimeLocal(event?.endDate || null)}
                onChange={(e) => {
                  if (e.target.value) {
                    setValue("endDate", new Date(e.target.value));
                  } else {
                    setValue("endDate", undefined);
                  }
                }}
                error={!!errors.endDate}
              />
            </FormField>
          </div>

          <FormField label="Location" error={errors.location?.message}>
            <Input
              {...register("location")}
              error={!!errors.location}
              placeholder="Community Center, 123 Main St"
            />
          </FormField>

          <FormField label="Location URL" error={errors.locationUrl?.message}>
            <Input
              {...register("locationUrl")}
              error={!!errors.locationUrl}
              placeholder="https://maps.google.com/..."
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Registration Settings</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <Checkbox
              label="Allow Registration"
              {...register("allowRegistration")}
            />
            <Checkbox
              label="Close Registration"
              {...register("registrationClosed")}
            />
          </div>

          <FormField
            label="Max Attendees"
            error={errors.maxAttendees?.message}
          >
            <Input
              type="number"
              {...register("maxAttendees", { valueAsNumber: true })}
              error={!!errors.maxAttendees}
              placeholder="Leave empty for unlimited"
              className="w-32"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Publishing</h2>
        <div className="flex gap-6">
          <Checkbox label="Published" {...register("isPublished")} />
          <Checkbox label="Featured" {...register("isFeatured")} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">SEO Settings</h2>
        <div className="space-y-4">
          <FormField
            label="SEO Title"
            error={errors.translation?.seoTitle?.message}
          >
            <Input
              {...register("translation.seoTitle")}
              error={!!errors.translation?.seoTitle}
              placeholder="Custom SEO title (defaults to event title)"
            />
          </FormField>

          <FormField
            label="SEO Description"
            error={errors.translation?.seoDescription?.message}
          >
            <Textarea
              {...register("translation.seoDescription")}
              error={!!errors.translation?.seoDescription}
              placeholder="Meta description for search engines..."
              rows={3}
            />
          </FormField>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
