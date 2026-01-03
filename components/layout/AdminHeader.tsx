"use client";

import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <nav className="flex h-14 items-center justify-between px-6">
        <Link href="/dashboard" className="text-sm font-medium">
          Admin Panel
        </Link>
        <div className="flex items-center gap-4">
          {/* Admin navigation and user menu will be added in future phases */}
        </div>
      </nav>
    </header>
  );
}
