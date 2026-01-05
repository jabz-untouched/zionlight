import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { managedImageSchema } from "@/features/admin/schemas";
import { z } from "zod";

/**
 * GET /api/admin/media
 * Fetch all managed images with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const activeOnly = searchParams.get("active") === "true";

    const where: Record<string, unknown> = {};
    
    if (context && ["HERO", "HOME", "GLOBAL"].includes(context)) {
      where.context = context;
    }
    
    if (activeOnly) {
      where.isActive = true;
    }

    const images = await db.managedImage.findMany({
      where,
      orderBy: [{ context: "asc" }, { order: "asc" }],
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("GET /api/admin/media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/media
 * Create a new managed image
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = managedImageSchema.parse(body);

    // If this is a HERO image and it's active, deactivate other active HERO images
    if (validated.context === "HERO" && validated.isActive) {
      await db.managedImage.updateMany({
        where: { context: "HERO", isActive: true },
        data: { isActive: false },
      });
    }

    // If this is a GLOBAL fallback and it's active, deactivate other active GLOBAL images
    if (validated.context === "GLOBAL" && validated.isActive) {
      await db.managedImage.updateMany({
        where: { context: "GLOBAL", isActive: true },
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

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/media error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "An image with this key already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create image" },
      { status: 500 }
    );
  }
}
