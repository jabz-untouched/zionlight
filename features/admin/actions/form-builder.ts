"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { FieldType } from "@prisma/client";
import {
  registrationFieldSchema,
  registrationFormSchema,
  generateDynamicFormSchema,
  type RegistrationFieldFormData,
  type RegistrationFormFormData,
  type FormSubmissionResponse,
} from "../schemas";

// ============================================
// FORM MANAGEMENT
// ============================================

/**
 * Get or create a registration form for an event
 */
export async function getOrCreateEventForm(eventId: string) {
  try {
    let form = await db.eventRegistrationForm.findUnique({
      where: { eventId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form) {
      form = await db.eventRegistrationForm.create({
        data: {
          eventId,
          isActive: false,
          fields: {
            create: [
              {
                label: "Full Name",
                placeholder: "Enter your full name",
                fieldType: "TEXT",
                isRequired: true,
                order: 0,
              },
              {
                label: "Email Address",
                placeholder: "your@email.com",
                fieldType: "EMAIL",
                isRequired: true,
                order: 1,
              },
            ],
          },
        },
        include: {
          fields: {
            orderBy: { order: "asc" },
          },
        },
      });
    }

    return { success: true, data: form };
  } catch (error) {
    console.error("Get/create event form error:", error);
    return { success: false, error: "Failed to load form" };
  }
}

/**
 * Get event form for public display (only if active)
 */
export async function getPublicEventForm(eventId: string) {
  try {
    const form = await db.eventRegistrationForm.findUnique({
      where: { eventId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form || !form.isActive) {
      return { success: false, error: "Registration form not available" };
    }

    return { success: true, data: form };
  } catch (error) {
    console.error("Get public event form error:", error);
    return { success: false, error: "Failed to load form" };
  }
}

/**
 * Toggle form active status
 */
export async function toggleFormActive(formId: string, isActive: boolean) {
  try {
    const form = await db.eventRegistrationForm.update({
      where: { id: formId },
      data: { isActive },
      include: { event: true },
    });

    revalidatePath(`/admin/events/${form.event.id}/form`);
    revalidatePath(`/events/${form.event.slug}`);

    return { success: true, data: form };
  } catch (error) {
    console.error("Toggle form active error:", error);
    return { success: false, error: "Failed to update form status" };
  }
}

/**
 * Update form settings (totalSteps, isActive)
 */
export async function updateFormSettings(
  formId: string,
  data: RegistrationFormFormData
) {
  try {
    const parsed = registrationFormSchema.parse(data);

    const form = await db.eventRegistrationForm.update({
      where: { id: formId },
      data: {
        isActive: parsed.isActive,
        totalSteps: parsed.totalSteps,
      },
      include: { event: true },
    });

    revalidatePath(`/admin/events/${form.event.id}/form`);
    revalidatePath(`/events/${form.event.slug}`);

    return { success: true, data: form };
  } catch (error) {
    console.error("Update form settings error:", error);
    return { success: false, error: "Failed to update form settings" };
  }
}

// ============================================
// FIELD MANAGEMENT
// ============================================

/**
 * Add a new field to a form
 */
export async function addFormField(
  formId: string,
  data: RegistrationFieldFormData
) {
  try {
    const parsed = registrationFieldSchema.parse(data);

    // Get the highest order value
    const maxOrder = await db.eventRegistrationField.aggregate({
      where: { formId },
      _max: { order: true },
    });

    const field = await db.eventRegistrationField.create({
      data: {
        formId,
        label: parsed.label,
        placeholder: parsed.placeholder || null,
        fieldType: parsed.fieldType as FieldType,
        options: parsed.options && parsed.options.length > 0 
          ? parsed.options 
          : Prisma.JsonNull,
        isRequired: parsed.isRequired ?? false,
        order: (maxOrder._max.order ?? -1) + 1,
        step: parsed.step ?? 1,
        conditionalLogic: parsed.conditionalLogic 
          ? (parsed.conditionalLogic as object)
          : Prisma.JsonNull,
        maxFileSize: parsed.maxFileSize ?? null,
        acceptedTypes: parsed.acceptedTypes ?? null,
      },
    });

    const form = await db.eventRegistrationForm.findUnique({
      where: { id: formId },
      include: { event: true },
    });

    if (form) {
      revalidatePath(`/admin/events/${form.event.id}/form`);
    }

    return { success: true, data: field };
  } catch (error) {
    console.error("Add form field error:", error);
    return { success: false, error: "Failed to add field" };
  }
}

/**
 * Update an existing field
 */
export async function updateFormField(
  fieldId: string,
  data: RegistrationFieldFormData
) {
  try {
    const parsed = registrationFieldSchema.parse(data);

    const field = await db.eventRegistrationField.update({
      where: { id: fieldId },
      data: {
        label: parsed.label,
        placeholder: parsed.placeholder || null,
        fieldType: parsed.fieldType as FieldType,
        options: parsed.options && parsed.options.length > 0 
          ? parsed.options 
          : Prisma.JsonNull,
        isRequired: parsed.isRequired ?? false,
        step: parsed.step ?? 1,
        conditionalLogic: parsed.conditionalLogic 
          ? (parsed.conditionalLogic as object)
          : Prisma.JsonNull,
        maxFileSize: parsed.maxFileSize ?? null,
        acceptedTypes: parsed.acceptedTypes ?? null,
      },
      include: {
        form: {
          include: { event: true },
        },
      },
    });

    revalidatePath(`/admin/events/${field.form.event.id}/form`);

    return { success: true, data: field };
  } catch (error) {
    console.error("Update form field error:", error);
    return { success: false, error: "Failed to update field" };
  }
}

/**
 * Delete a field
 */
export async function deleteFormField(fieldId: string) {
  try {
    const field = await db.eventRegistrationField.findUnique({
      where: { id: fieldId },
      include: {
        form: {
          include: { event: true },
        },
      },
    });

    if (!field) {
      return { success: false, error: "Field not found" };
    }

    await db.eventRegistrationField.delete({
      where: { id: fieldId },
    });

    revalidatePath(`/admin/events/${field.form.event.id}/form`);

    return { success: true };
  } catch (error) {
    console.error("Delete form field error:", error);
    return { success: false, error: "Failed to delete field" };
  }
}

/**
 * Reorder a field (move up or down)
 */
export async function reorderFormField(
  fieldId: string,
  direction: "up" | "down"
) {
  try {
    const field = await db.eventRegistrationField.findUnique({
      where: { id: fieldId },
      include: {
        form: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
            event: true,
          },
        },
      },
    });

    if (!field) {
      return { success: false, error: "Field not found" };
    }

    const fields = field.form.fields;
    const currentIndex = fields.findIndex((f) => f.id === fieldId);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === fields.length - 1)
    ) {
      return { success: true }; // Already at boundary
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapField = fields[swapIndex];

    if (!swapField) {
      return { success: false, error: "Cannot reorder field" };
    }

    // Swap orders
    await db.$transaction([
      db.eventRegistrationField.update({
        where: { id: fieldId },
        data: { order: swapField.order },
      }),
      db.eventRegistrationField.update({
        where: { id: swapField.id },
        data: { order: field.order },
      }),
    ]);

    revalidatePath(`/admin/events/${field.form.event.id}/form`);

    return { success: true };
  } catch (error) {
    console.error("Reorder form field error:", error);
    return { success: false, error: "Failed to reorder field" };
  }
}

// ============================================
// FORM SUBMISSIONS
// ============================================

/**
 * Submit a dynamic form
 */
export async function submitDynamicForm(
  eventId: string,
  formId: string,
  responses: FormSubmissionResponse
) {
  try {
    // Get form with fields for validation
    const form = await db.eventRegistrationForm.findUnique({
      where: { id: formId },
      include: {
        fields: true,
        event: true,
      },
    });

    if (!form || !form.isActive) {
      return { success: false, error: "Registration form is not active" };
    }

    // Check if event allows registration
    if (!form.event.allowRegistration || form.event.registrationClosed) {
      return { success: false, error: "Registration is closed for this event" };
    }

    // Check capacity
    if (form.event.maxAttendees) {
      const submissionCount = await db.eventFormSubmission.count({
        where: { eventId },
      });
      if (submissionCount >= form.event.maxAttendees) {
        return { success: false, error: "This event has reached maximum capacity" };
      }
    }

    // Generate and validate with dynamic schema
    const dynamicSchema = generateDynamicFormSchema(
      form.fields.map((f) => ({
        id: f.id,
        label: f.label,
        fieldType: f.fieldType as FieldType,
        isRequired: f.isRequired,
        options: f.options as string[] | null,
      }))
    );

    const validationResult = dynamicSchema.safeParse(responses);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errors };
    }

    // Extract email for duplicate checking
    const emailField = form.fields.find((f) => f.fieldType === "EMAIL");
    const email = emailField ? (responses[emailField.id] as string) : null;

    // Check for duplicate email submission
    if (email) {
      const existing = await db.eventFormSubmission.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        },
      });
      if (existing) {
        return { success: false, error: "You have already registered for this event" };
      }
    }

    // Create submission
    const submission = await db.eventFormSubmission.create({
      data: {
        eventId,
        formId,
        responses: responses as object,
        email,
      },
    });

    revalidatePath(`/events/${form.event.slug}`);
    revalidatePath(`/admin/events/${eventId}/registrations`);

    return { success: true, data: submission };
  } catch (error) {
    console.error("Submit dynamic form error:", error);
    return { success: false, error: "Failed to submit registration" };
  }
}

/**
 * Get all submissions for an event
 */
export async function getEventSubmissions(eventId: string) {
  try {
    const [submissions, form] = await Promise.all([
      db.eventFormSubmission.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
      }),
      db.eventRegistrationForm.findUnique({
        where: { eventId },
        include: {
          fields: {
            orderBy: { order: "asc" },
          },
        },
      }),
    ]);

    return { success: true, data: { submissions, form } };
  } catch (error) {
    console.error("Get event submissions error:", error);
    return { success: false, error: "Failed to load submissions" };
  }
}

/**
 * Export submissions as CSV data
 */
export async function exportSubmissionsCSV(eventId: string) {
  try {
    const result = await getEventSubmissions(eventId);
    if (!result.success || !result.data) {
      return { success: false, error: "Failed to load submissions" };
    }

    const { submissions, form } = result.data;
    if (!form || submissions.length === 0) {
      return { success: false, error: "No submissions to export" };
    }

    // Build CSV header
    const headers = ["Submitted At", ...form.fields.map((f) => f.label)];

    // Build CSV rows
    const rows = submissions.map((submission) => {
      const responses = submission.responses as Record<string, string | boolean>;
      const row = [
        submission.createdAt.toISOString(),
        ...form.fields.map((field) => {
          const value = responses[field.id];
          if (typeof value === "boolean") return value ? "Yes" : "No";
          return String(value || "");
        }),
      ];
      return row;
    });

    // Create CSV content
    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Export submissions CSV error:", error);
    return { success: false, error: "Failed to export submissions" };
  }
}

/**
 * Get submission count for an event
 */
export async function getSubmissionCount(eventId: string) {
  try {
    const count = await db.eventFormSubmission.count({
      where: { eventId },
    });
    return { success: true, data: count };
  } catch (error) {
    console.error("Get submission count error:", error);
    return { success: false, error: "Failed to get count" };
  }
}

// ============================================
// FILE UPLOAD HANDLING
// ============================================

// Import validateFile from utils for server-side validation
import { validateFile } from "../utils/form-helpers";

/**
 * Upload a file and create metadata record
 * In production, this would upload to cloud storage (Vercel Blob, S3, etc.)
 * For now, we store as base64 data URL (suitable for very small files)
 */
export async function uploadFormFile(
  submissionId: string,
  fieldId: string,
  file: {
    name: string;
    size: number;
    type: string;
    data: string; // Base64 encoded data
  }
): Promise<{ success: boolean; data?: { id: string; storageUrl: string }; error?: string }> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Get field for additional validation
    const field = await db.eventRegistrationField.findUnique({
      where: { id: fieldId },
    });

    if (field) {
      const fieldValidation = validateFile(file, field.maxFileSize, field.acceptedTypes);
      if (!fieldValidation.valid) {
        return { success: false, error: fieldValidation.error };
      }
    }

    // Create file record
    // In production, upload to Vercel Blob/S3 and store the URL
    // For demo, store as data URL (only works for very small files)
    const storageUrl = `data:${file.type};base64,${file.data}`;

    const fileRecord = await db.eventFormFile.create({
      data: {
        submissionId,
        fieldId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storageUrl,
      },
    });

    return { success: true, data: { id: fileRecord.id, storageUrl: fileRecord.storageUrl } };
  } catch (error) {
    console.error("Upload form file error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

/**
 * Get files for a submission
 */
export async function getSubmissionFiles(submissionId: string) {
  try {
    const files = await db.eventFormFile.findMany({
      where: { submissionId },
    });
    return { success: true, data: files };
  } catch (error) {
    console.error("Get submission files error:", error);
    return { success: false, error: "Failed to get files" };
  }
}
