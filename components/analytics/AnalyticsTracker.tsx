"use client";

import { useEffect, useRef } from "react";
import { trackBlogPostView, trackEventView } from "@/lib/analytics";

interface AnalyticsTrackerProps {
  type: "blog" | "event" | "program";
  slug: string;
  title: string;
  category?: string;
  isUpcoming?: boolean;
}

/**
 * Client component that tracks content views
 * 
 * Renders nothing visible - just triggers analytics on mount
 * Uses a ref to ensure single tracking per mount
 */
export function AnalyticsTracker({
  type,
  slug,
  title,
  category,
  isUpcoming,
}: AnalyticsTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Prevent double tracking in strict mode
    if (tracked.current) return;
    tracked.current = true;

    switch (type) {
      case "blog":
        trackBlogPostView(slug, title, category);
        break;
      case "event":
        trackEventView(slug, title, isUpcoming ?? false);
        break;
      case "program":
        // Use generic event for programs
        trackBlogPostView(slug, title, "program");
        break;
    }
  }, [type, slug, title, category, isUpcoming]);

  // Render nothing
  return null;
}
