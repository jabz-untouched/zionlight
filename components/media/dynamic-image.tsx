import Image from "next/image";
import { db } from "@/lib/db";
import { cn } from "@/utils/cn";
import type { ImageContext } from "@/features/admin/schemas";
import { HeroSlider } from "./hero-background";

/**
 * Fetches a managed image by key
 */
export async function getManagedImage(key: string) {
  try {
    const image = await db.managedImage.findFirst({
      where: { key, isActive: true },
    });
    return image;
  } catch (error) {
    console.error("Error fetching managed image:", error);
    return null;
  }
}

/**
 * Fetches all active managed images by context
 */
export async function getManagedImagesByContext(context: ImageContext) {
  try {
    const images = await db.managedImage.findMany({
      where: { context, isActive: true },
      orderBy: { order: "asc" },
    });
    return images;
  } catch (error) {
    console.error("Error fetching managed images:", error);
    return [];
  }
}

/**
 * Fetches the active hero image
 */
export async function getActiveHeroImage() {
  try {
    const image = await db.managedImage.findFirst({
      where: { context: "HERO", isActive: true },
      orderBy: { order: "asc" },
    });
    return image;
  } catch (error) {
    console.error("Error fetching hero image:", error);
    return null;
  }
}

/**
 * Fetches all active hero images for the slider
 */
export async function getAllActiveHeroImages() {
  try {
    const images = await db.managedImage.findMany({
      where: { context: "HERO", isActive: true },
      orderBy: { order: "asc" },
    });
    return images;
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
}

/**
 * Fetches the global fallback image
 */
export async function getGlobalFallbackImage() {
  try {
    const image = await db.managedImage.findFirst({
      where: { context: "GLOBAL", isActive: true, key: "global-fallback" },
    });
    return image;
  } catch (error) {
    console.error("Error fetching global fallback:", error);
    return null;
  }
}

interface DynamicImageProps {
  imageKey: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackUrl?: string;
  priority?: boolean;
}

/**
 * DynamicImage Component
 * Fetches and renders a managed image by key
 */
export async function DynamicImage({
  imageKey,
  alt,
  fill = false,
  width,
  height,
  className,
  fallbackUrl,
  priority = false,
}: DynamicImageProps) {
  const image = await getManagedImage(imageKey);
  const globalFallback = !image ? await getGlobalFallbackImage() : null;

  const imageUrl = image?.imageUrl || globalFallback?.imageUrl || fallbackUrl;
  const imageAlt = alt || image?.altText || image?.title || "Image";

  if (!imageUrl) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={imageAlt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
    />
  );
}

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
  fallbackGradient?: boolean;
  autoPlayInterval?: number;
}

/**
 * HeroSection Component
 * Renders a hero section with image slider and motion effects
 * Server component that fetches data, delegates rendering to client component
 */
export async function HeroSection({
  children,
  className,
  overlayOpacity = 0.65,
  fallbackGradient = true,
  autoPlayInterval = 6000,
}: HeroSectionProps) {
  const heroImages = await getAllActiveHeroImages();
  
  // Transform to slider format
  const sliderImages = heroImages.map(img => ({
    imageUrl: img.imageUrl,
    altText: img.altText,
    title: img.title,
  }));

  // Get position from first image or default to CENTER
  const position = heroImages[0]?.position || "CENTER";

  return (
    <HeroSlider
      images={sliderImages}
      position={position}
      overlayOpacity={overlayOpacity}
      fallbackGradient={fallbackGradient}
      className={className}
      autoPlayInterval={autoPlayInterval}
    >
      {children}
    </HeroSlider>
  );
}

interface FeatureImageProps {
  imageKey: string;
  alt?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

/**
 * FeatureImage Component
 * Renders a feature image with fallback
 */
export async function FeatureImage({
  imageKey,
  alt,
  className,
  aspectRatio = "video",
}: FeatureImageProps) {
  const image = await getManagedImage(imageKey);
  const globalFallback = !image ? await getGlobalFallbackImage() : null;

  const imageUrl = image?.imageUrl || globalFallback?.imageUrl;
  const imageAlt = alt || image?.altText || image?.title || "Feature image";

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  if (!imageUrl) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center",
        aspectClasses[aspectRatio],
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl">🌟</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", aspectClasses[aspectRatio], className)}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
  );
}

interface PlaceholderImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackIcon?: string;
}

/**
 * PlaceholderImage Component
 * Renders an image with global fallback if src is not provided
 */
export async function PlaceholderImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  fallbackIcon = "🌟",
}: PlaceholderImageProps) {
  const globalFallback = !src ? await getGlobalFallbackImage() : null;
  const imageUrl = src || globalFallback?.imageUrl;

  if (!imageUrl) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center",
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl">{fallbackIcon}</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
    />
  );
}
