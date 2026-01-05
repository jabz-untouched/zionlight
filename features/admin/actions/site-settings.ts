"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettingSchema, type SiteSettingFormData } from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create or update a site setting
 */
export async function upsertSiteSetting(data: SiteSettingFormData): Promise<ActionResult> {
  try {
    const validated = siteSettingSchema.parse(data);

    const setting = await db.siteSettings.upsert({
      where: { key: validated.key },
      update: {
        value: validated.value,
        description: validated.description || null,
      },
      create: {
        key: validated.key,
        value: validated.value,
        description: validated.description || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true, data: setting };
  } catch (error) {
    console.error("Upsert site setting error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to save setting" };
  }
}

/**
 * Delete a site setting
 */
export async function deleteSiteSetting(key: string): Promise<ActionResult> {
  try {
    await db.siteSettings.delete({ where: { key } });

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Delete site setting error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete setting" };
  }
}

// ============================================
// PUBLIC DATA FETCHING FUNCTIONS
// ============================================

/**
 * Get a single site setting by key
 */
export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const setting = await db.siteSettings.findUnique({
      where: { key },
    });
    return setting?.value || null;
  } catch (error) {
    console.error("Get site setting error:", error);
    return null;
  }
}

/**
 * Get multiple site settings by keys
 */
export async function getSiteSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const settings = await db.siteSettings.findMany({
      where: { key: { in: keys } },
    });
    
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Get site settings error:", error);
    return {};
  }
}

/**
 * Get all site settings for admin
 */
export async function getAllSiteSettings() {
  try {
    const settings = await db.siteSettings.findMany({
      orderBy: { key: "asc" },
    });
    return settings;
  } catch (error) {
    console.error("Get all site settings error:", error);
    return [];
  }
}

// ============================================
// PREDEFINED SETTING KEYS - see features/admin/schemas.ts for SITE_SETTING_KEYS constant
