"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerForEvent } from "@/features/admin/actions/registrations";
import { Button, Card } from "@/features/admin/components";
import { trackEventRegistration } from "@/lib/analytics";

const registrationFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

interface EventRegistrationFormProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  maxAttendees: number | null;
  registrationCount: number;
}

export function EventRegistrationForm({
  eventId,
  eventSlug,
  eventTitle,
  maxAttendees,
  registrationCount,
}: EventRegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const spotsLeft = maxAttendees ? maxAttendees - registrationCount : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
  });

  // Track when user starts filling the form
  const handleFormFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEventRegistration(eventSlug, "start");
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setError(null);

    const result = await registerForEvent(eventId, data);

    if (result.success) {
      setIsSubmitted(true);
      trackEventRegistration(eventSlug, "success");
    } else {
      const errorMessage = result.error || "Something went wrong. Please try again.";
      setError(errorMessage);
      trackEventRegistration(eventSlug, "error", errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
            Registration Successful!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Thank you for registering for <strong>{eventTitle}</strong>. 
            We&apos;ll be in touch with more details soon.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Register for this Event</h3>
      
      {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          ⚠️ Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining!
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormFocus} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            {...register("fullName")}
            type="text"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes or Questions
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
            placeholder="Any dietary restrictions, accessibility needs, or questions..."
          />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Register Now
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By registering, you agree to receive event-related communications.
        </p>
      </form>
    </Card>
  );
}
