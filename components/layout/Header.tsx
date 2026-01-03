"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Zionlight Family Foundation
        </Link>
        <div className="flex items-center gap-6">
          {/* Navigation items will be added in future phases */}
        </div>
      </nav>
    </header>
  );
}
