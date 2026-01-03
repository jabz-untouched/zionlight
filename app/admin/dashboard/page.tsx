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
  const [programCount, teamCount, galleryCount] = await Promise.all([
    db.program.count(),
    db.teamMember.count(),
    db.galleryItem.count(),
  ]);

  return { programCount, teamCount, galleryCount };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Programs",
      count: stats.programCount,
      href: "/admin/programs",
      description: "Manage foundation programs",
    },
    {
      title: "Team Members",
      count: stats.teamCount,
      href: "/admin/team",
      description: "Manage team and leadership",
    },
    {
      title: "Gallery",
      count: stats.galleryCount,
      href: "/admin/gallery",
      description: "Manage photos and media",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Zionlight Family Foundation admin panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:border-primary">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{card.title}</h3>
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
  );
}
