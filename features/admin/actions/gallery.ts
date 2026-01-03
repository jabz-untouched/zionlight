"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { galleryItemSchema, type GalleryItemFormData } from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create a new gallery item
 */
export async function createGalleryItem(data: GalleryItemFormData): Promise<ActionResult> {
  try {
    const validated = galleryItemSchema.parse(data);

    const galleryItem = await db.galleryItem.create({
      data: {
        ...validated,
        thumbnailUrl: validated.thumbnailUrl || null,
        description: validated.description || null,
        category: validated.category || null,
        takenAt: validated.takenAt || null,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/(admin)/gallery");

    return { success: true, data: galleryItem };
  } catch (error) {
    console.error("Create gallery item error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create gallery item" };
  }
}

/**
 * Update an existing gallery item
 */
export async function updateGalleryItem(
  id: string,
  data: GalleryItemFormData
): Promise<ActionResult> {
  try {
    const validated = galleryItemSchema.parse(data);

    const galleryItem = await db.galleryItem.update({
      where: { id },
      data: {
        ...validated,
        thumbnailUrl: validated.thumbnailUrl || null,
        description: validated.description || null,
        category: validated.category || null,
        takenAt: validated.takenAt || null,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/(admin)/gallery");
    revalidatePath(`/(admin)/gallery/${id}`);

    return { success: true, data: galleryItem };
  } catch (error) {
    console.error("Update gallery item error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update gallery item" };
  }
}

/**
 * Delete a gallery item
 */
export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    await db.galleryItem.delete({ where: { id } });

    revalidatePath("/gallery");
    revalidatePath("/(admin)/gallery");

    return { success: true };
  } catch (error) {
    console.error("Delete gallery item error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete gallery item" };
  }
}

/**
 * Toggle gallery item active status
 */
export async function toggleGalleryItemActive(id: string): Promise<ActionResult> {
  try {
    const item = await db.galleryItem.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Gallery item not found" };
    }

    const updated = await db.galleryItem.update({
      where: { id },
      data: { isActive: !item.isActive },
    });

    revalidatePath("/gallery");
    revalidatePath("/(admin)/gallery");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle gallery item active error:", error);
    return { success: false, error: "Failed to toggle active status" };
  }
}
