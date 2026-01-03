import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Programs",
  description: "Discover our community programs and initiatives making a difference.",
};

export default function ProgramsPage() {
  return (
    <section className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Our Programs</h1>
      {/* Programs content will be dynamic in future phases */}
    </section>
  );
}
