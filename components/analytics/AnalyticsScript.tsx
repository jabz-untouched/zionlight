"use client";

import Script from "next/script";
import { ANALYTICS_CONFIG } from "@/lib/analytics";

/**
 * Analytics Script Component
 * 
 * Loads Plausible Analytics script in a non-blocking way.
 * The script:
 * - Is loaded with defer to not block rendering
 * - Uses the afterInteractive strategy for optimal performance
 * - Only loads in production (or when explicitly enabled)
 * 
 * Usage:
 * Add <AnalyticsScript /> to your root layout
 */
export function AnalyticsScript() {
  // Don't render script if analytics is disabled
  if (!ANALYTICS_CONFIG.enabled && !ANALYTICS_CONFIG.localEnabled) {
    return null;
  }

  // Don't render if domain is not configured
  if (!ANALYTICS_CONFIG.domain) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Analytics] NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set. Analytics disabled."
      );
    }
    return null;
  }

  const scriptSrc = `${ANALYTICS_CONFIG.host}/js/script.js`;

  return (
    <Script
      defer
      data-domain={ANALYTICS_CONFIG.domain}
      src={scriptSrc}
      strategy="afterInteractive"
    />
  );
}
