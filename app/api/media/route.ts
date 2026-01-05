import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/media
 * Public endpoint to fetch active managed images
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const key = searchParams.get("key");

    // Fetch by key
    if (key) {
      const image = await db.managedImage.findFirst({
        where: { key, isActive: true },
        select: {
          id: true,
          key: true,
          title: true,
          altText: true,
          imageUrl: true,
          context: true,
          position: true,
        },
      });

      if (!image) {
        // Try to get global fallback
        const fallback = await db.managedImage.findFirst({
          where: { context: "GLOBAL", isActive: true },
          select: {
            id: true,
            key: true,
            title: true,
            altText: true,
            imageUrl: true,
            context: true,
            position: true,
          },
        });

        return NextResponse.json({ 
          success: true, 
          data: fallback,
          fallback: true 
        });
      }

      return NextResponse.json({ success: true, data: image });
    }

    // Fetch by context
    const where: Record<string, unknown> = { isActive: true };
    
    if (context && ["HERO", "HOME", "GLOBAL"].includes(context)) {
      where.context = context;
    }

    const images = await db.managedImage.findMany({
      where,
      orderBy: { order: "asc" },
      select: {
        id: true,
        key: true,
        title: true,
        altText: true,
        imageUrl: true,
        context: true,
        position: true,
      },
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
