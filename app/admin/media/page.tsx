import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { PageHeader, DataTable, StatusBadge } from "@/features/admin/components/ui";
import { DeleteButton, ToggleActiveButton } from "@/features/admin/components/actions";
import { deleteManagedImage, toggleManagedImageActive } from "@/features/admin/actions/managed-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media Management | Admin",
  description: "Manage hero images, homepage features, and global placeholders.",
};

type ImageContext = "HERO" | "HOME" | "GLOBAL";

type ManagedImageRow = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  altText: string | null;
  imageUrl: string;
  context: ImageContext;
  position: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

async function getManagedImages(): Promise<ManagedImageRow[]> {
  return db.managedImage.findMany({
    orderBy: [{ context: "asc" }, { order: "asc" }],
  }) as Promise<ManagedImageRow[]>;
}

const contextLabels: Record<ImageContext, { label: string; color: string }> = {
  HERO: { label: "Hero", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  HOME: { label: "Home", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  GLOBAL: { label: "Global", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

export default async function MediaPage() {
  const images = await getManagedImages();

  const columns = [
    {
      key: "imageUrl" as const,
      label: "Preview",
      render: (item: ManagedImageRow) => (
        <div className="relative h-12 w-20 overflow-hidden rounded bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.altText || item.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title" as const,
      label: "Title",
      render: (item: ManagedImageRow) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground font-mono">{item.key}</div>
        </div>
      ),
    },
    {
      key: "context" as const,
      label: "Context",
      render: (item: ManagedImageRow) => {
        const ctx = contextLabels[item.context];
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ctx?.color || ""}`}>
            {ctx?.label || item.context}
          </span>
        );
      },
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (item: ManagedImageRow) => (
        <StatusBadge active={item.isActive} />
      ),
    },
    {
      key: "order" as const,
      label: "Order",
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (item: ManagedImageRow) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/media/${item.id}/edit`}
            className="text-sm text-primary hover:underline"
          >
            Edit
          </Link>
          <ToggleActiveButton
            id={item.id}
            isActive={item.isActive}
            onToggle={toggleManagedImageActive}
          />
          <DeleteButton
            id={item.id}
            onDelete={deleteManagedImage}
            itemName="image"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Management"
        description="Manage hero images, homepage features, and global placeholders."
        action={{ label: "Add Image", href: "/admin/media/new" }}
      />

      <div className="space-y-4">
        <div className="flex gap-2 text-sm">
          <span className="text-muted-foreground">Quick filters:</span>
          <span className={`px-2 py-0.5 rounded text-xs ${contextLabels.HERO?.color || ""}`}>
            Hero: {images.filter((i: ManagedImageRow) => i.context === "HERO").length}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs ${contextLabels.HOME?.color || ""}`}>
            Home: {images.filter((i: ManagedImageRow) => i.context === "HOME").length}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs ${contextLabels.GLOBAL?.color || ""}`}>
            Global: {images.filter((i: ManagedImageRow) => i.context === "GLOBAL").length}
          </span>
        </div>

        <DataTable
          columns={columns}
          data={images}
          emptyMessage="No managed images yet. Add your first image to get started."
        />
      </div>

      <div className="rounded-lg border border-dashed p-6">
        <h3 className="font-medium mb-2">Image Context Guide</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Hero:</strong> Main hero section images (only one active at a time)</li>
          <li><strong>Home:</strong> Homepage feature images for programs, about section, CTAs</li>
          <li><strong>Global:</strong> Fallback/placeholder images used across the site</li>
        </ul>
      </div>
    </div>
  );
}
