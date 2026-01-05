export { ANALYTICS_CONFIG, ANALYTICS_EVENTS } from "./config";
export type { AnalyticsEvent, EventProps } from "./config";
export {
  trackEvent,
  trackPageView,
  trackCTAClick,
  trackBlogPostView,
  trackEventView,
  trackEventRegistration,
  trackExternalLink,
  trackSocialClick,
  trackContactFormSubmit,
} from "./client";
