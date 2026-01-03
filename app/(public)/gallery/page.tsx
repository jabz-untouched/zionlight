import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "See our impact through photos and stories from the community.",
};

export default function GalleryPage() {
  return (
    <section className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
      {/* Gallery content will be dynamic in future phases */}
    </section>
  );
}
