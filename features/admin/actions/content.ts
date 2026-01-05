"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { 
  pageContentSchema, 
  type PageContentFormData,
  type PageId 
} from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create a new page content section
 */
export async function createPageContent(data: PageContentFormData): Promise<ActionResult> {
  try {
    const validated = pageContentSchema.parse(data);

    const content = await db.pageContent.create({
      data: {
        ...validated,
        title: validated.title || null,
        subtitle: validated.subtitle || null,
        ctaText: validated.ctaText || null,
        ctaLink: validated.ctaLink || null,
        imageUrl: validated.imageUrl || null,
        imageAlt: validated.imageAlt || null,
        metadata: validated.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${validated.pageId === "home" ? "" : validated.pageId}`);
    revalidatePath("/admin/content");

    return { success: true, data: content };
  } catch (error) {
    console.error("Create page content error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A section with this page ID and section key already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create content" };
  }
}

/**
 * Update an existing page content section
 */
export async function updatePageContent(
  id: string,
  data: PageContentFormData
): Promise<ActionResult> {
  try {
    const validated = pageContentSchema.parse(data);

    const content = await db.pageContent.update({
      where: { id },
      data: {
        ...validated,
        title: validated.title || null,
        subtitle: validated.subtitle || null,
        ctaText: validated.ctaText || null,
        ctaLink: validated.ctaLink || null,
        imageUrl: validated.imageUrl || null,
        imageAlt: validated.imageAlt || null,
        metadata: validated.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${validated.pageId === "home" ? "" : validated.pageId}`);
    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${id}`);

    return { success: true, data: content };
  } catch (error) {
    console.error("Update page content error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A section with this page ID and section key already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update content" };
  }
}

/**
 * Delete a page content section
 */
export async function deletePageContent(id: string): Promise<ActionResult> {
  try {
    const content = await db.pageContent.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath(`/${content.pageId === "home" ? "" : content.pageId}`);
    revalidatePath("/admin/content");

    return { success: true };
  } catch (error) {
    console.error("Delete page content error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete content" };
  }
}

/**
 * Toggle page content active status
 */
export async function togglePageContentActive(id: string): Promise<ActionResult> {
  try {
    const content = await db.pageContent.findUnique({ where: { id } });
    
    if (!content) {
      return { success: false, error: "Content not found" };
    }

    const updated = await db.pageContent.update({
      where: { id },
      data: { isActive: !content.isActive },
    });

    revalidatePath("/");
    revalidatePath(`/${content.pageId === "home" ? "" : content.pageId}`);
    revalidatePath("/admin/content");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle page content error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle content status" };
  }
}

// ============================================
// PUBLIC DATA FETCHING FUNCTIONS
// ============================================

/**
 * Get a single content section by page and key
 */
export async function getPageSection(pageId: PageId, sectionKey: string) {
  try {
    const content = await db.pageContent.findFirst({
      where: { 
        pageId, 
        sectionKey, 
        isActive: true 
      },
    });
    return content;
  } catch (error) {
    console.error("Get page section error:", error);
    return null;
  }
}

/**
 * Get all active content sections for a page
 */
export async function getPageSections(pageId: PageId) {
  try {
    const sections = await db.pageContent.findMany({
      where: { 
        pageId, 
        isActive: true 
      },
      orderBy: { order: "asc" },
    });
    return sections;
  } catch (error) {
    console.error("Get page sections error:", error);
    return [];
  }
}

/**
 * Get multiple specific sections by page and keys
 */
export async function getPageSectionsByKeys(pageId: PageId, sectionKeys: string[]) {
  try {
    const sections = await db.pageContent.findMany({
      where: { 
        pageId, 
        sectionKey: { in: sectionKeys },
        isActive: true 
      },
      orderBy: { order: "asc" },
    });
    
    // Return as a map for easy access
    return sections.reduce((acc, section) => {
      acc[section.sectionKey] = section;
      return acc;
    }, {} as Record<string, typeof sections[0]>);
  } catch (error) {
    console.error("Get page sections by keys error:", error);
    return {};
  }
}

/**
 * Get all content for admin listing
 */
export async function getAllPageContent() {
  try {
    const content = await db.pageContent.findMany({
      orderBy: [{ pageId: "asc" }, { order: "asc" }],
    });
    return content;
  } catch (error) {
    console.error("Get all page content error:", error);
    return [];
  }
}
