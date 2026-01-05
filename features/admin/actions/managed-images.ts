"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { managedImageSchema, type ManagedImageFormData, type ImageContext } from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create a new managed image
 */
export async function createManagedImage(data: ManagedImageFormData): Promise<ActionResult> {
  try {
    const validated = managedImageSchema.parse(data);

    // If this is a HERO image and it's active, deactivate other active HERO images
    if (validated.context === "HERO" && validated.isActive) {
      await db.managedImage.updateMany({
        where: { context: "HERO", isActive: true },
        data: { isActive: false },
      });
    }

    const image = await db.managedImage.create({
      data: {
        ...validated,
        description: validated.description || null,
        altText: validated.altText || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/media");

    return { success: true, data: image };
  } catch (error) {
    console.error("Create managed image error:", error);
    if (error instanceof Error) {
      // Handle unique constraint violation
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "An image with this key already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create managed image" };
  }
}

/**
 * Update an existing managed image
 */
export async function updateManagedImage(
  id: string,
  data: ManagedImageFormData
): Promise<ActionResult> {
  try {
    const validated = managedImageSchema.parse(data);

    // If this is a HERO image being activated, deactivate other active HERO images
    if (validated.context === "HERO" && validated.isActive) {
      await db.managedImage.updateMany({
        where: { 
          context: "HERO", 
          isActive: true,
          id: { not: id }
        },
        data: { isActive: false },
      });
    }

    const image = await db.managedImage.update({
      where: { id },
      data: {
        ...validated,
        description: validated.description || null,
        altText: validated.altText || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/media");
    revalidatePath(`/admin/media/${id}`);

    return { success: true, data: image };
  } catch (error) {
    console.error("Update managed image error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "An image with this key already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update managed image" };
  }
}

/**
 * Delete a managed image
 */
export async function deleteManagedImage(id: string): Promise<ActionResult> {
  try {
    await db.managedImage.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/media");

    return { success: true };
  } catch (error) {
    console.error("Delete managed image error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete managed image" };
  }
}

/**
 * Toggle managed image active status
 */
export async function toggleManagedImageActive(id: string): Promise<ActionResult> {
  try {
    const image = await db.managedImage.findUnique({ where: { id } });
    
    if (!image) {
      return { success: false, error: "Image not found" };
    }

    const newActiveState = !image.isActive;

    // If activating a HERO image, deactivate other active HERO images
    if (image.context === "HERO" && newActiveState) {
      await db.managedImage.updateMany({
        where: { 
          context: "HERO", 
          isActive: true,
          id: { not: id }
        },
        data: { isActive: false },
      });
    }

    const updated = await db.managedImage.update({
      where: { id },
      data: { isActive: newActiveState },
    });

    revalidatePath("/");
    revalidatePath("/admin/media");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle managed image error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle image status" };
  }
}

/**
 * Get managed image by key (for public consumption)
 */
export async function getManagedImageByKey(key: string) {
  try {
    const image = await db.managedImage.findFirst({
      where: { key, isActive: true },
    });
    return image;
  } catch (error) {
    console.error("Get managed image error:", error);
    return null;
  }
}

/**
 * Get all active managed images by context
 */
export async function getManagedImagesByContext(context: ImageContext) {
  try {
    const images = await db.managedImage.findMany({
      where: { context, isActive: true },
      orderBy: { order: "asc" },
    });
    return images;
  } catch (error) {
    console.error("Get managed images by context error:", error);
    return [];
  }
}

/**
 * Get active hero image (only one should be active)
 */
export async function getActiveHeroImage() {
  try {
    const image = await db.managedImage.findFirst({
      where: { context: "HERO", isActive: true },
      orderBy: { order: "asc" },
    });
    return image;
  } catch (error) {
    console.error("Get active hero image error:", error);
    return null;
  }
}

/**
 * Get active global fallback image
 */
export async function getGlobalFallbackImage() {
  try {
    const image = await db.managedImage.findFirst({
      where: { context: "GLOBAL", isActive: true, key: "global-fallback" },
    });
    return image;
  } catch (error) {
    console.error("Get global fallback image error:", error);
    return null;
  }
}
