import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy policy, terms of service, and legal information.",
};

export default function LegalPage() {
  return (
    <section className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Legal</h1>
      {/* Legal content will be dynamic in future phases */}
    </section>
  );
}
