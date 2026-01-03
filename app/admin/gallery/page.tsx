import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
} from "@/features/admin/components";
import { DeleteButton, ToggleButton } from "@/features/admin/components/actions";
import { deleteGalleryItem, toggleGalleryItemActive } from "@/features/admin/actions/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Manage gallery items.",
};

async function getGalleryItems() {
  return db.galleryItem.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage photos and media."
        action={{ label: "Add Item", href: "/admin/gallery/new" }}
      />

      <DataTable
        data={items}
        emptyMessage="No gallery items yet. Add your first image."
        columns={[
          {
            key: "title",
            label: "Image",
            render: (item) => (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl || item.imageUrl}
                  alt={item.title}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.category && (
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "tags",
            label: "Tags",
            render: (item) => (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-1.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "isActive",
            label: "Status",
            render: (item) => <StatusBadge active={item.isActive} />,
          },
          {
            key: "isFeatured",
            label: "Featured",
            render: (item) => (item.isFeatured ? "Yes" : "No"),
          },
          {
            key: "actions",
            label: "Actions",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/gallery/${item.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <ToggleButton
                  id={item.id}
                  isActive={item.isActive}
                  onToggle={toggleGalleryItemActive}
                />
                <DeleteButton
                  id={item.id}
                  onDelete={deleteGalleryItem}
                  itemName="gallery item"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
