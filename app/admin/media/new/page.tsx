import type { Metadata } from "next";
import { ManagedImageForm } from "../_components/managed-image-form";

export const metadata: Metadata = {
  title: "Add Image | Media Management",
  description: "Add a new managed image.",
};

export default function NewManagedImagePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Image</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new managed image for hero sections, homepage features, or global placeholders.
        </p>
      </div>

      <ManagedImageForm />
    </div>
  );
}
