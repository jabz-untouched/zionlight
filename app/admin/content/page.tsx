import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, StatusBadge } from "@/features/admin/components/ui";
import { DeleteButton, ToggleButton } from "@/features/admin/components/actions";
import { deletePageContent, togglePageContentActive } from "@/features/admin/actions/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content Management | Admin",
  description: "Manage page content and sections.",
};

type PageContentRow = {
  id: string;
  pageId: string;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  body: string;
  ctaText: string | null;
  ctaLink: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function getPageContent(): Promise<PageContentRow[]> {
  return db.pageContent.findMany({
    orderBy: [{ pageId: "asc" }, { order: "asc" }],
  }) as Promise<PageContentRow[]>;
}

const pageLabels: Record<string, { label: string; color: string }> = {
  home: { label: "Home", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  about: { label: "About", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  programs: { label: "Programs", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  gallery: { label: "Gallery", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  contact: { label: "Contact", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  legal: { label: "Legal", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

export default async function ContentPage() {
  const content = await getPageContent();

  const columns = [
    {
      key: "pageId" as const,
      label: "Page",
      render: (item: PageContentRow) => {
        const page = pageLabels[item.pageId];
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${page?.color || ""}`}>
            {page?.label || item.pageId}
          </span>
        );
      },
    },
    {
      key: "sectionKey" as const,
      label: "Section",
      render: (item: PageContentRow) => (
        <div>
          <div className="font-medium font-mono text-sm">{item.sectionKey}</div>
          {item.title && (
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.title}</div>
          )}
        </div>
      ),
    },
    {
      key: "body" as const,
      label: "Preview",
      render: (item: PageContentRow) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
          {item.body.substring(0, 100)}...
        </p>
      ),
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (item: PageContentRow) => (
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
      render: (item: PageContentRow) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/content/${item.id}/edit`}
            className="text-sm text-primary hover:underline"
          >
            Edit
          </Link>
          <ToggleButton
            id={item.id}
            isActive={item.isActive}
            onToggle={togglePageContentActive}
          />
          <DeleteButton
            id={item.id}
            onDelete={deletePageContent}
            itemName="content"
          />
        </div>
      ),
    },
  ];

  // Group content by page for stats
  const pageStats = Object.entries(pageLabels).map(([key, { label }]) => ({
    key,
    label,
    count: content.filter(c => c.pageId === key).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Manage page content sections for all public pages."
        action={{ label: "Add Content", href: "/admin/content/new" }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Sections by page:</span>
          {pageStats.map(stat => (
            <span 
              key={stat.key}
              className={`px-2 py-0.5 rounded text-xs ${pageLabels[stat.key]?.color || ""}`}
            >
              {stat.label}: {stat.count}
            </span>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={content}
          emptyMessage="No content sections yet. Add your first content to get started."
        />
      </div>

      <div className="rounded-lg border border-dashed p-6">
        <h3 className="font-medium mb-2">Content Section Guide</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Home:</strong> Hero, mission statement, programs preview, CTA sections</li>
          <li><strong>About:</strong> Who we are, story, vision, mission, HEMER values, director&apos;s message</li>
          <li><strong>Programs:</strong> Intro text for the programs listing page</li>
          <li><strong>Gallery:</strong> Gallery page intro text</li>
          <li><strong>Contact:</strong> Contact page intro and information</li>
        </ul>
      </div>
    </div>
  );
}
