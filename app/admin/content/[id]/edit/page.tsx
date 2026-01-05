import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageContentForm } from "../../_components/page-content-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Content | Content Management",
  description: "Edit a page content section.",
};

async function getPageContent(id: string) {
  return db.pageContent.findUnique({ where: { id } });
}

export default async function EditPageContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getPageContent(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the content for <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{content.pageId}/{content.sectionKey}</span>
        </p>
      </div>

      <PageContentForm initialData={content} />
    </div>
  );
}
