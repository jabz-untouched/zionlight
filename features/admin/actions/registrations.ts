"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  eventRegistrationSchema,
  type EventRegistrationFormData,
} from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

// ============================================
// PUBLIC REGISTRATION ACTIONS
// ============================================

export async function registerForEvent(
  eventId: string,
  data: Omit<EventRegistrationFormData, "eventId">
): Promise<ActionResult> {
  try {
    // Validate the registration data
    const validated = eventRegistrationSchema.parse({ ...data, eventId });

    // Check if event exists and is open for registration
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    if (!event.isPublished) {
      return { success: false, error: "Event is not available" };
    }

    if (!event.allowRegistration) {
      return { success: false, error: "Registration is not available for this event" };
    }

    if (event.registrationClosed) {
      return { success: false, error: "Registration is closed for this event" };
    }

    // Check if event is in the past
    if (event.startDate < new Date()) {
      return { success: false, error: "This event has already started" };
    }

    // Check if max attendees reached
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      return { success: false, error: "This event is at full capacity" };
    }

    // Check for duplicate registration
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: validated.email.toLowerCase(),
        },
      },
    });

    if (existingRegistration) {
      return {
        success: false,
        error: "You have already registered for this event with this email address",
      };
    }

    // Create registration
    const registration = await db.eventRegistration.create({
      data: {
        eventId,
        fullName: validated.fullName,
        email: validated.email.toLowerCase(),
        phone: validated.phone || null,
        notes: validated.notes || null,
        status: "PENDING",
      },
    });

    revalidatePath(`/events/${event.slug}`);
    revalidatePath(`/admin/events/${eventId}`);

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error("Register for event error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to register for event" };
  }
}

// ============================================
// ADMIN REGISTRATION ACTIONS
// ============================================

export async function updateRegistrationStatus(
  registrationId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
): Promise<ActionResult> {
  try {
    const registration = await db.eventRegistration.update({
      where: { id: registrationId },
      data: { status },
      include: {
        event: true,
      },
    });

    revalidatePath(`/admin/events/${registration.eventId}`);
    revalidatePath(`/events/${registration.event.slug}`);

    return { success: true, data: registration };
  } catch (error) {
    console.error("Update registration status error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update registration status" };
  }
}

export async function deleteRegistration(registrationId: string): Promise<ActionResult> {
  try {
    const registration = await db.eventRegistration.delete({
      where: { id: registrationId },
      include: {
        event: true,
      },
    });

    revalidatePath(`/admin/events/${registration.eventId}`);
    revalidatePath(`/events/${registration.event.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Delete registration error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete registration" };
  }
}

export async function getEventRegistrations(eventId: string) {
  try {
    const registrations = await db.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return registrations;
  } catch (error) {
    console.error("Get event registrations error:", error);
    return [];
  }
}

export async function exportEventRegistrationsCSV(eventId: string): Promise<ActionResult> {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        translations: {
          take: 1,
        },
        registrations: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Build CSV content
    const headers = ["Full Name", "Email", "Phone", "Notes", "Status", "Registered At"];
    const rows = event.registrations.map((reg) => [
      reg.fullName,
      reg.email,
      reg.phone || "",
      reg.notes || "",
      reg.status,
      reg.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return {
      success: true,
      data: {
        filename: `${event.slug}-registrations-${new Date().toISOString().split("T")[0]}.csv`,
        content: csvContent,
        mimeType: "text/csv",
      },
    };
  } catch (error) {
    console.error("Export registrations CSV error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to export registrations" };
  }
}

// ============================================
// REGISTRATION STATS
// ============================================

export async function getRegistrationStats(eventId: string) {
  try {
    const stats = await db.eventRegistration.groupBy({
      by: ["status"],
      where: { eventId },
      _count: { status: true },
    });

    const result = {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    };

    for (const stat of stats) {
      result.total += stat._count.status;
      if (stat.status === "PENDING") result.pending = stat._count.status;
      if (stat.status === "CONFIRMED") result.confirmed = stat._count.status;
      if (stat.status === "CANCELLED") result.cancelled = stat._count.status;
    }

    return result;
  } catch (error) {
    console.error("Get registration stats error:", error);
    return { total: 0, pending: 0, confirmed: 0, cancelled: 0 };
  }
}
