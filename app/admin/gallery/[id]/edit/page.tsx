import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components";
import { GalleryItemForm } from "../../_components/gallery-item-form";

export const dynamic = "force-dynamic";

interface EditGalleryItemPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Gallery Item",
  description: "Edit gallery item details.",
};

async function getGalleryItem(id: string) {
  return db.galleryItem.findUnique({ where: { id } });
}

export default async function EditGalleryItemPage({ params }: EditGalleryItemPageProps) {
  const { id } = await params;
  const item = await getGalleryItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Gallery Item"
        description={`Editing: ${item.title}`}
      />
      <GalleryItemForm item={item} />
    </div>
  );
}
