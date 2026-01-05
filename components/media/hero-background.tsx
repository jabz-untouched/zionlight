"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/utils/cn";

interface HeroImage {
  imageUrl: string;
  altText?: string | null;
  title: string;
}

interface HeroSliderProps {
  images: HeroImage[];
  position?: "LEFT" | "CENTER" | "RIGHT";
  overlayOpacity?: number;
  fallbackGradient?: boolean;
  children: React.ReactNode;
  className?: string;
  autoPlayInterval?: number;
}

/**
 * HeroSlider - Client component with image slider and motion effects
 * Supports multiple hero images with auto-advancement
 */
export function HeroSlider({
  images,
  position = "CENTER",
  overlayOpacity = 0.6,
  fallbackGradient = true,
  children,
  className,
  autoPlayInterval = 6000,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = images.length > 0;

  const nextSlide = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, nextSlide]);

  const currentImage = hasImages ? images[currentIndex] : null;

  return (
    <section className={cn(
      "relative min-h-[90vh] flex items-center justify-center overflow-hidden",
      className
    )}>
      {/* Background Images Slider */}
      {hasImages ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 1, ease: "easeInOut" },
                scale: { duration: 8, ease: "linear" }
              }}
            >
              <Image
                src={currentImage!.imageUrl}
                alt={currentImage!.altText || currentImage!.title}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Dark gradient overlay for text readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"
            style={{ opacity: overlayOpacity }}
          />

          {/* Slide Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "bg-white scale-110" 
                      : "bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Arrow Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </>
      ) : fallbackGradient ? (
        <>
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </>
      ) : null}

      {/* Content with text positioning */}
      <motion.div 
        className={cn(
          "relative z-10 w-full",
          position === "LEFT" && "text-left",
          position === "CENTER" && "text-center",
          position === "RIGHT" && "text-right",
          hasImages && "text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.7),_0_4px_16px_rgba(0,0,0,0.5)]"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

// Keep backward compatibility with single image
interface HeroBackgroundProps {
  imageUrl?: string | null;
  altText?: string;
  position?: "LEFT" | "CENTER" | "RIGHT";
  overlayOpacity?: number;
  fallbackGradient?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * HeroBackground - Client component with motion effects (single image)
 * @deprecated Use HeroSlider for multiple images
 */
export function HeroBackground({
  imageUrl,
  altText = "Hero background",
  position = "CENTER",
  overlayOpacity = 0.6,
  fallbackGradient = true,
  children,
  className,
}: HeroBackgroundProps) {
  const images = imageUrl ? [{ imageUrl, altText, title: altText }] : [];
  
  return (
    <HeroSlider
      images={images}
      position={position}
      overlayOpacity={overlayOpacity}
      fallbackGradient={fallbackGradient}
      className={className}
    >
      {children}
    </HeroSlider>
  );
}

/**
 * HeroImagePreview - For admin preview
 */
export function HeroImagePreview({
  imageUrl,
  altText = "Preview",
}: {
  imageUrl: string;
  altText?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h3 className="text-2xl font-bold mb-2">Preview</h3>
          <p className="text-sm opacity-80">This is how the hero will appear</p>
        </div>
      </div>
    </div>
  );
}
