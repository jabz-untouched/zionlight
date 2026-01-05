import type { Metadata } from "next";
import { Section, Container, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] items-center justify-center py-20">
      <Container className="text-center">
        <div className="mb-8 text-8xl font-bold text-muted-foreground/30">
          404
        </div>
        <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mb-8 max-w-md mx-auto text-lg text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" size="lg">
            Go Home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </Container>
    </Section>
  );
}
