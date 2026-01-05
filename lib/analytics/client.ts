"use client";

import { ANALYTICS_CONFIG, type AnalyticsEvent, type EventProps } from "./config";

/**
 * Extended window interface for Plausible
 */
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: EventProps; callback?: () => void }
    ) => void;
  }
}

/**
 * Check if analytics is available
 */
function isAnalyticsAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (!ANALYTICS_CONFIG.enabled && !ANALYTICS_CONFIG.localEnabled) return false;
  return true;
}

/**
 * Track a custom event
 * 
 * @param event - Event name from ANALYTICS_EVENTS
 * @param props - Optional properties to attach to the event
 * @param callback - Optional callback after event is sent
 * 
 * @example
 * trackEvent("Blog Post View", { slug: "my-post", category: "News" });
 */
export function trackEvent(
  event: AnalyticsEvent | string,
  props?: EventProps,
  callback?: () => void
): void {
  if (!isAnalyticsAvailable()) {
    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, props);
    }
    callback?.();
    return;
  }

  // Queue event if plausible isn't loaded yet
  if (!window.plausible) {
    // Create a queue for events before script loads
    const queue: unknown[][] = [];
    const queueFn = (...args: unknown[]) => {
      queue.push(args);
    };
    (queueFn as unknown as { q: unknown[][] }).q = queue;
    window.plausible = queueFn as unknown as typeof window.plausible;
  }

  window.plausible?.(event, { props, callback });
}

/**
 * Track a page view (for custom page tracking beyond automatic)
 */
export function trackPageView(path?: string): void {
  if (!isAnalyticsAvailable()) return;

  const url = path || window.location.pathname;
  trackEvent("pageview", { url });
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  destination?: string
): void {
  trackEvent("CTA Click", {
    name: ctaName,
    location: ctaLocation,
    destination: destination || "internal",
  });
}

/**
 * Track blog post views with metadata
 */
export function trackBlogPostView(
  slug: string,
  title: string,
  category?: string
): void {
  trackEvent("Blog Post View", {
    slug,
    title,
    category: category || "uncategorized",
  });
}

/**
 * Track event page views
 */
export function trackEventView(
  slug: string,
  title: string,
  isUpcoming: boolean
): void {
  trackEvent("Event View", {
    slug,
    title,
    status: isUpcoming ? "upcoming" : "past",
  });
}

/**
 * Track event registration flow
 */
export function trackEventRegistration(
  eventSlug: string,
  step: "start" | "success" | "error",
  errorMessage?: string
): void {
  const eventName =
    step === "start"
      ? "Event Registration Start"
      : step === "success"
        ? "Event Registration Success"
        : "Event Registration Error";

  trackEvent(eventName, {
    event_slug: eventSlug,
    ...(errorMessage && { error: errorMessage }),
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, context?: string): void {
  trackEvent("External Link Click", {
    url,
    context: context || "general",
  });
}

/**
 * Track social media link clicks
 */
export function trackSocialClick(platform: string): void {
  trackEvent("Social Link Click", {
    platform,
  });
}

/**
 * Track contact form submissions
 */
export function trackContactFormSubmit(success: boolean): void {
  trackEvent("Contact Form Submit", {
    success: success ? "true" : "false",
  });
}
