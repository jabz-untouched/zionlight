import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/features/admin/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard for Zionlight Family Foundation.",
};

async function getStats() {
  const [programCount, teamCount, galleryCount, blogCount, eventCount, mediaCount] = await Promise.all([
    db.program.count(),
    db.teamMember.count(),
    db.galleryItem.count(),
    db.blogPost.count(),
    db.event.count(),
    db.managedImage.count(),
  ]);

  return { programCount, teamCount, galleryCount, blogCount, eventCount, mediaCount };
}

const quickActions = [
  { href: "/admin/programs/new", label: "New Program", icon: "➕" },
  { href: "/admin/blog/new", label: "New Blog Post", icon: "✍️" },
  { href: "/admin/events/new", label: "New Event", icon: "📅" },
  { href: "/admin/team/new", label: "New Team Member", icon: "👤" },
  { href: "/admin/gallery/new", label: "New Gallery Item", icon: "🖼️" },
  { href: "/admin/media", label: "Upload Media", icon: "📤" },
];

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Programs",
      count: stats.programCount,
      href: "/admin/programs",
      description: "Manage foundation programs",
      icon: "📋",
    },
    {
      title: "Blog Posts",
      count: stats.blogCount,
      href: "/admin/blog",
      description: "Manage blog articles",
      icon: "✍️",
    },
    {
      title: "Events",
      count: stats.eventCount,
      href: "/admin/events",
      description: "Manage events and registrations",
      icon: "📅",
    },
    {
      title: "Team Members",
      count: stats.teamCount,
      href: "/admin/team",
      description: "Manage team and leadership",
      icon: "👥",
    },
    {
      title: "Gallery",
      count: stats.galleryCount,
      href: "/admin/gallery",
      description: "Manage photos and media",
      icon: "🖼️",
    },
    {
      title: "Media Library",
      count: stats.mediaCount,
      href: "/admin/media",
      description: "Manage uploaded images",
      icon: "🎨",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Zionlight Family Foundation admin panel.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm transition-colors hover:border-primary hover:bg-primary/5">
                <span className="text-lg">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="transition-colors hover:border-primary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.icon}</span>
                    <h3 className="font-medium">{card.title}</h3>
                  </div>
                  <span className="text-2xl font-bold">{card.count}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">All Sections</h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/admin/content" className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary/5">
            <span className="text-xl">📝</span>
            <div>
              <p className="font-medium">Content</p>
              <p className="text-sm text-muted-foreground">Manage page content</p>
            </div>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary/5">
            <span className="text-xl">⚙️</span>
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-sm text-muted-foreground">Site configuration</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
