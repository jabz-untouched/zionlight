import type { Metadata } from "next";
import { PageHeader } from "@/features/admin/components";
import { GalleryItemForm } from "../_components/gallery-item-form";

export const metadata: Metadata = {
  title: "New Gallery Item",
  description: "Add a new gallery item.",
};

export default function NewGalleryItemPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Gallery Item"
        description="Add a new image to the gallery."
      />
      <GalleryItemForm />
    </div>
  );
}
