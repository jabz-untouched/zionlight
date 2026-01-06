"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { GalleryItem } from "@prisma/client";
import { Badge } from "@/components/ui";

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors touch-action-manipulation active:scale-95 ${
              selectedCategory === null 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors touch-action-manipulation active:scale-95 ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`relative group cursor-pointer touch-action-manipulation ${
                item.isFeatured ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(item)}
            >
              <div className={`relative overflow-hidden rounded-lg sm:rounded-xl bg-muted ${
                item.isFeatured ? "aspect-square" : "aspect-square"
              }`}>
                <Image
                  src={item.thumbnailUrl || item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Always show title on mobile, hover on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-1">
                    {item.title}
                  </h3>
                  {item.category && (
                    <p className="hidden sm:block text-white/70 text-xs mt-1">{item.category}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 sm:-top-12 right-0 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all touch-action-manipulation z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative flex-1 min-h-0">
                <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* Image Info */}
              <div className="mt-3 sm:mt-4 text-white">
                <h2 className="text-lg sm:text-xl font-semibold">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-sm sm:text-base text-white/70 mt-2">{selectedImage.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedImage.category && (
                    <Badge variant="outline" className="border-white/30 text-white">
                      {selectedImage.category}
                    </Badge>
                  )}
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {selectedImage.takenAt && (
                  <p className="text-white/50 text-sm mt-3">
                    {new Date(selectedImage.takenAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
