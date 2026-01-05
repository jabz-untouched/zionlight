/**
 * Analytics Configuration
 * 
 * We use Plausible Analytics for privacy-friendly tracking.
 * - No cookies
 * - GDPR compliant
 * - Lightweight script (~1KB)
 * - No cross-site tracking
 * 
 * Configuration:
 * Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env for your domain
 * Set NEXT_PUBLIC_PLAUSIBLE_HOST if self-hosting (optional)
 */

export const ANALYTICS_CONFIG = {
  /**
   * Your site domain (e.g., "zionlightfamily.org")
   */
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",

  /**
   * Plausible host URL (for self-hosted instances)
   * Default: Plausible Cloud
   */
  host: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io",

  /**
   * Enable/disable analytics
   */
  enabled: process.env.NODE_ENV === "production" && !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,

  /**
   * Enable local development tracking (for testing)
   */
  localEnabled: process.env.NEXT_PUBLIC_ANALYTICS_DEV === "true",
};

/**
 * Custom event names for tracking
 */
export const ANALYTICS_EVENTS = {
  // Page-level events
  BLOG_POST_VIEW: "Blog Post View",
  EVENT_VIEW: "Event View",
  PROGRAM_VIEW: "Program View",

  // Engagement events
  CTA_CLICK: "CTA Click",
  CONTACT_FORM_SUBMIT: "Contact Form Submit",
  
  // Event registration
  EVENT_REGISTRATION_START: "Event Registration Start",
  EVENT_REGISTRATION_SUCCESS: "Event Registration Success",
  EVENT_REGISTRATION_ERROR: "Event Registration Error",

  // Navigation
  EXTERNAL_LINK_CLICK: "External Link Click",
  SOCIAL_LINK_CLICK: "Social Link Click",
  
  // Gallery
  GALLERY_IMAGE_VIEW: "Gallery Image View",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Event properties type
 */
export interface EventProps {
  [key: string]: string | number | boolean | undefined;
}
