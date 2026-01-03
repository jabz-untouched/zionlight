import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Zionlight Family Foundation.",
};

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>
      {/* Contact form will be added in future phases */}
    </section>
  );
}
