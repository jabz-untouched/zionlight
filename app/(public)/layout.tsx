import { Header, Footer } from "@/components/layout";
import { OrganizationJsonLd } from "@/components/seo";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Organization structured data for SEO */}
      <OrganizationJsonLd />
      <div className="relative flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
