import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission, vision, and the team behind Zionlight Family Foundation.",
};

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About Us</h1>
      {/* About content will be dynamic in future phases */}
    </section>
  );
}
