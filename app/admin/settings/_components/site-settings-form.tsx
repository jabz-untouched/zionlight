"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertSiteSetting } from "@/features/admin/actions/site-settings";
import { FormField, Input, Textarea, Button, Card } from "@/features/admin/components/ui";

interface SettingItem {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
  value: string;
  hasValue: boolean;
}

interface SiteSettingsFormProps {
  settings: SettingItem[];
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(
    settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>)
  );
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleSave = (key: string, description: string) => {
    setError(null);
    startTransition(async () => {
      const result = await upsertSiteSetting({
        key,
        value: values[key] || "",
        description,
      });

      if (result.success) {
        setSavedKeys(prev => new Set([...prev, key]));
        router.refresh();
        // Clear saved indicator after 2 seconds
        setTimeout(() => {
          setSavedKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }, 2000);
      } else {
        setError(result.error || "Failed to save");
      }
    });
  };

  const handleSaveAll = () => {
    setError(null);
    startTransition(async () => {
      for (const setting of settings) {
        await upsertSiteSetting({
          key: setting.key,
          value: values[setting.key] || "",
          description: setting.description,
        });
      }
      router.refresh();
      setSavedKeys(new Set(settings.map(s => s.key)));
      setTimeout(() => setSavedKeys(new Set()), 2000);
    });
  };

  // Group settings
  const footerSettings = settings.filter(s => s.key.startsWith("footer"));
  const contactSettings = settings.filter(s => s.key.startsWith("contact"));
  const socialSettings = settings.filter(s => s.key.startsWith("social"));

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Footer Settings */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Footer Settings</h3>
        <div className="space-y-4">
          {footerSettings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <FormField label={setting.label}>
                {setting.key.includes("tagline") ? (
                  <Textarea
                    value={values[setting.key]}
                    onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                    placeholder={setting.defaultValue}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={values[setting.key]}
                    onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                    placeholder={setting.defaultValue}
                  />
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant={savedKeys.has(setting.key) ? "secondary" : "ghost"}
                    onClick={() => handleSave(setting.key, setting.description)}
                    disabled={isPending}
                  >
                    {savedKeys.has(setting.key) ? "✓ Saved" : "Save"}
                  </Button>
                </div>
              </FormField>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Settings */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="space-y-4">
          {contactSettings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <FormField label={setting.label}>
                {setting.key.includes("address") ? (
                  <Textarea
                    value={values[setting.key]}
                    onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                    placeholder={setting.defaultValue}
                    rows={2}
                  />
                ) : (
                  <Input
                    value={values[setting.key]}
                    onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                    placeholder={setting.defaultValue}
                  />
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant={savedKeys.has(setting.key) ? "secondary" : "ghost"}
                    onClick={() => handleSave(setting.key, setting.description)}
                    disabled={isPending}
                  >
                    {savedKeys.has(setting.key) ? "✓ Saved" : "Save"}
                  </Button>
                </div>
              </FormField>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Settings */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
        <div className="space-y-4">
          {socialSettings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <FormField label={setting.label}>
                <Input
                  value={values[setting.key]}
                  onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                  placeholder={setting.defaultValue}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant={savedKeys.has(setting.key) ? "secondary" : "ghost"}
                    onClick={() => handleSave(setting.key, setting.description)}
                    disabled={isPending}
                  >
                    {savedKeys.has(setting.key) ? "✓ Saved" : "Save"}
                  </Button>
                </div>
              </FormField>
            </div>
          ))}
        </div>
      </Card>

      {/* Save All Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSaveAll}
          loading={isPending}
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
