import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { managedImageSchema } from "@/features/admin/schemas";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/media/[id]
 * Fetch a single managed image by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const image = await db.managedImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("GET /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/media/[id]
 * Update a managed image
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = managedImageSchema.parse(body);

    // Check if image exists
    const existing = await db.managedImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

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

    // If this is a GLOBAL fallback being activated, deactivate other active GLOBAL images
    if (validated.context === "GLOBAL" && validated.isActive) {
      await db.managedImage.updateMany({
        where: { 
          context: "GLOBAL", 
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

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("PUT /api/admin/media/[id] error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update image" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/media/[id]
 * Toggle image active status
 */
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const image = await db.managedImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
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

    // If activating a GLOBAL image, deactivate other active GLOBAL images
    if (image.context === "GLOBAL" && newActiveState) {
      await db.managedImage.updateMany({
        where: { 
          context: "GLOBAL", 
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

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle image status" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete a managed image
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const image = await db.managedImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    await db.managedImage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
