import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MotionProvider } from "@/components/providers";
import { AnalyticsScript } from "@/components/analytics";
import { generateMetadata as generateSEO, DEFAULT_SEO } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Root metadata - uses SEO utility for consistency
 * Individual pages override with their own generateMetadata
 */
export const metadata: Metadata = {
  ...generateSEO({
    title: DEFAULT_SEO.siteName,
    description: DEFAULT_SEO.siteDescription,
    canonicalUrl: DEFAULT_SEO.siteUrl,
  }),
  // Template for child pages
  title: {
    default: DEFAULT_SEO.siteName,
    template: `%s | ${DEFAULT_SEO.siteName}`,
  },
  metadataBase: new URL(DEFAULT_SEO.siteUrl),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="DUrjufJQIksTO5XB7Tb2sPA0MeFbh9nV2DwRQ2oG95k" />
        {/* Analytics script - loads non-blocking after page interactive */}
        <AnalyticsScript />
      </head>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
