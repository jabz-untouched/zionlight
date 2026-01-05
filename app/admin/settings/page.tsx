import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components/ui";
import { SiteSettingsForm } from "./_components/site-settings-form";
import { SITE_SETTING_KEYS } from "@/features/admin/schemas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Settings | Admin",
  description: "Manage site-wide settings and configuration.",
};

type SiteSettingRow = {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

async function getSiteSettings(): Promise<SiteSettingRow[]> {
  return db.siteSettings.findMany({
    orderBy: { key: "asc" },
  }) as Promise<SiteSettingRow[]>;
}

// Predefined settings with defaults
const defaultSettings = [
  {
    key: SITE_SETTING_KEYS.FOOTER_TAGLINE,
    label: "Footer Tagline",
    description: "The tagline displayed in the website footer",
    defaultValue: "Empowering communities through faith, love, and dedicated service. Building bridges of hope for a brighter tomorrow.",
  },
  {
    key: SITE_SETTING_KEYS.FOOTER_COPYRIGHT,
    label: "Footer Copyright Text",
    description: "Additional copyright or legal text in the footer",
    defaultValue: "A registered 501(c)(3) non-profit organization",
  },
  {
    key: SITE_SETTING_KEYS.CONTACT_EMAIL,
    label: "Contact Email",
    description: "Primary contact email address",
    defaultValue: "info@zionlight.org",
  },
  {
    key: SITE_SETTING_KEYS.CONTACT_PHONE,
    label: "Contact Phone",
    description: "Primary contact phone number",
    defaultValue: "+1 (555) 123-4567",
  },
  {
    key: SITE_SETTING_KEYS.CONTACT_ADDRESS,
    label: "Contact Address",
    description: "Physical address for the organization",
    defaultValue: "123 Faith Street, Community Center\nHope City, HC 12345",
  },
  {
    key: SITE_SETTING_KEYS.SOCIAL_FACEBOOK,
    label: "Facebook URL",
    description: "Facebook page URL",
    defaultValue: "https://facebook.com/zionlightfoundation",
  },
  {
    key: SITE_SETTING_KEYS.SOCIAL_INSTAGRAM,
    label: "Instagram URL",
    description: "Instagram profile URL",
    defaultValue: "https://instagram.com/zionlightfoundation",
  },
  {
    key: SITE_SETTING_KEYS.SOCIAL_TWITTER,
    label: "Twitter/X URL",
    description: "Twitter/X profile URL",
    defaultValue: "https://twitter.com/zionlightfdn",
  },
];

export default async function SettingsPage() {
  const existingSettings = await getSiteSettings();
  
  // Merge existing settings with defaults
  const settingsMap = existingSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const settingsWithValues = defaultSettings.map(setting => ({
    ...setting,
    value: settingsMap[setting.key] || setting.defaultValue,
    hasValue: !!settingsMap[setting.key],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        description="Manage site-wide configuration, contact information, and footer content."
      />

      <div className="grid gap-6">
        <SiteSettingsForm settings={settingsWithValues} />
      </div>

      <div className="rounded-lg border border-dashed p-6">
        <h3 className="font-medium mb-2">Settings Guide</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Footer:</strong> Tagline and copyright text displayed at the bottom of every page</li>
          <li><strong>Contact:</strong> Email, phone, and address shown on the contact page</li>
          <li><strong>Social:</strong> Links to social media profiles</li>
        </ul>
      </div>
    </div>
  );
}
