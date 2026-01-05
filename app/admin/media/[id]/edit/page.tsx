import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ManagedImageForm } from "../../_components/managed-image-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Image | Media Management",
  description: "Edit a managed image.",
};

async function getManagedImage(id: string) {
  return db.managedImage.findUnique({ where: { id } });
}

export default async function EditManagedImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getManagedImage(id);

  if (!image) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Image</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the managed image settings.
        </p>
      </div>

      <ManagedImageForm initialData={image} />
    </div>
  );
}
