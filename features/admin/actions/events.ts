"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  eventWithTranslationSchema,
  type EventWithTranslationFormData,
  DEFAULT_LOCALE,
} from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

// ============================================
// EVENT ACTIONS
// ============================================

export async function createEvent(data: EventWithTranslationFormData): Promise<ActionResult> {
  try {
    const validated = eventWithTranslationSchema.parse(data);
    const { translation, ...eventData } = validated;

    const event = await db.event.create({
      data: {
        ...eventData,
        endDate: eventData.endDate || null,
        location: eventData.location || null,
        locationUrl: eventData.locationUrl || null,
        bannerImage: eventData.bannerImage || null,
        maxAttendees: eventData.maxAttendees || null,
        translations: {
          create: {
            locale: translation.locale || DEFAULT_LOCALE,
            title: translation.title,
            description: translation.description,
            seoTitle: translation.seoTitle || null,
            seoDescription: translation.seoDescription || null,
          },
        },
      },
      include: {
        translations: true,
        registrations: true,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true, data: event };
  } catch (error) {
    console.error("Create event error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "An event with this slug already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(
  id: string,
  data: EventWithTranslationFormData
): Promise<ActionResult> {
  try {
    const validated = eventWithTranslationSchema.parse(data);
    const { translation, ...eventData } = validated;

    const event = await db.event.update({
      where: { id },
      data: {
        ...eventData,
        endDate: eventData.endDate || null,
        location: eventData.location || null,
        locationUrl: eventData.locationUrl || null,
        bannerImage: eventData.bannerImage || null,
        maxAttendees: eventData.maxAttendees || null,
      },
    });

    // Upsert translation
    await db.eventTranslation.upsert({
      where: {
        eventId_locale: {
          eventId: id,
          locale: translation.locale || DEFAULT_LOCALE,
        },
      },
      update: {
        title: translation.title,
        description: translation.description,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
      create: {
        eventId: id,
        locale: translation.locale || DEFAULT_LOCALE,
        title: translation.title,
        description: translation.description,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true, data: event };
  } catch (error) {
    console.error("Update event error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await db.event.delete({ where: { id } });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Delete event error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete event" };
  }
}

export async function toggleEventPublished(id: string): Promise<ActionResult> {
  try {
    const event = await db.event.findUnique({ where: { id } });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    const updated = await db.event.update({
      where: { id },
      data: { isPublished: !event.isPublished },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle event published error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle publish status" };
  }
}

export async function toggleEventRegistration(id: string): Promise<ActionResult> {
  try {
    const event = await db.event.findUnique({ where: { id } });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    const updated = await db.event.update({
      where: { id },
      data: { registrationClosed: !event.registrationClosed },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle event registration error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle registration status" };
  }
}

// ============================================
// PUBLIC EVENT QUERIES
// ============================================

export async function getUpcomingEvents(
  locale: string = DEFAULT_LOCALE,
  limit?: number
) {
  try {
    const now = new Date();

    const events = await db.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: now },
      },
      include: {
        translations: {
          where: { locale },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });

    return events.map((event) => {
      const translation =
        event.translations[0] || { title: "", description: "" };
      return {
        ...event,
        translation,
        registrationCount: event._count.registrations,
      };
    });
  } catch (error) {
    console.error("Get upcoming events error:", error);
    return [];
  }
}

export async function getPastEvents(
  locale: string = DEFAULT_LOCALE,
  limit?: number
) {
  try {
    const now = new Date();

    const events = await db.event.findMany({
      where: {
        isPublished: true,
        startDate: { lt: now },
      },
      include: {
        translations: {
          where: { locale },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "desc" },
      take: limit,
    });

    return events.map((event) => {
      const translation =
        event.translations[0] || { title: "", description: "" };
      return {
        ...event,
        translation,
        registrationCount: event._count.registrations,
      };
    });
  } catch (error) {
    console.error("Get past events error:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const event = await db.event.findFirst({
      where: { slug, isPublished: true },
      include: {
        translations: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) return null;

    // Try to get translation for requested locale, fallback to default
    const translation =
      event.translations.find((t) => t.locale === locale) ||
      event.translations.find((t) => t.locale === DEFAULT_LOCALE) ||
      event.translations[0];

    return {
      ...event,
      translation,
      registrationCount: event._count.registrations,
    };
  } catch (error) {
    console.error("Get event by slug error:", error);
    return null;
  }
}

export async function getFeaturedEvents(locale: string = DEFAULT_LOCALE, limit: number = 3) {
  try {
    const now = new Date();

    const events = await db.event.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
        startDate: { gte: now },
      },
      include: {
        translations: {
          where: { locale },
        },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });

    return events.map((event) => ({
      ...event,
      translation: event.translations[0],
    }));
  } catch (error) {
    console.error("Get featured events error:", error);
    return [];
  }
}

// ============================================
// ADMIN EVENT QUERIES
// ============================================

export async function getAllEvents() {
  try {
    const events = await db.event.findMany({
      include: {
        translations: {
          where: { locale: DEFAULT_LOCALE },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "desc" },
    });

    return events.map((event) => ({
      ...event,
      translation: event.translations[0],
      registrationCount: event._count.registrations,
    }));
  } catch (error) {
    console.error("Get all events error:", error);
    return [];
  }
}

export async function getEventById(id: string, locale: string = DEFAULT_LOCALE) {
  try {
    const event = await db.event.findUnique({
      where: { id },
      include: {
        translations: true,
        registrations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!event) return null;

    const translation =
      event.translations.find((t) => t.locale === locale) ||
      event.translations.find((t) => t.locale === DEFAULT_LOCALE) ||
      event.translations[0];

    return { ...event, translation };
  } catch (error) {
    console.error("Get event by id error:", error);
    return null;
  }
}
