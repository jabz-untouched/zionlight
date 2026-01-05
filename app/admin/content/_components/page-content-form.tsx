"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  pageContentSchema, 
  type PageContentFormData,
  type PageId,
} from "@/features/admin/schemas";
import { 
  createPageContent, 
  updatePageContent 
} from "@/features/admin/actions/content";
import { 
  FormField, 
  Input, 
  Textarea, 
  Checkbox, 
  Button, 
  Card 
} from "@/features/admin/components/ui";

interface PageContentFormProps {
  initialData?: {
    id: string;
    pageId: string;
    sectionKey: string;
    title: string | null;
    subtitle: string | null;
    body: string;
    ctaText: string | null;
    ctaLink: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
    order: number;
    isActive: boolean;
  };
}

const pageOptions: { value: PageId; label: string; description: string }[] = [
  { value: "home", label: "Home", description: "Homepage sections" },
  { value: "about", label: "About", description: "About page sections" },
  { value: "programs", label: "Programs", description: "Programs page intro" },
  { value: "gallery", label: "Gallery", description: "Gallery page intro" },
  { value: "contact", label: "Contact", description: "Contact page content" },
  { value: "legal", label: "Legal", description: "Legal pages content" },
];

const commonSectionKeys: Record<PageId, string[]> = {
  home: ["hero", "tagline", "mission-preview", "programs-intro", "hemer-snippet", "cta"],
  about: ["hero", "who-we-are", "our-story", "vision", "mission", "hemer-intro", "hemer-h", "hemer-e", "hemer-m", "hemer-e2", "hemer-r", "director-message", "team-intro"],
  programs: ["hero", "intro"],
  gallery: ["hero", "intro"],
  contact: ["hero", "intro"],
  legal: ["privacy", "terms"],
};

export function PageContentForm({ initialData }: PageContentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PageContentFormData>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageId: (initialData?.pageId as PageId) ?? "home",
      sectionKey: initialData?.sectionKey ?? "",
      title: initialData?.title ?? "",
      subtitle: initialData?.subtitle ?? "",
      body: initialData?.body ?? "",
      ctaText: initialData?.ctaText ?? "",
      ctaLink: initialData?.ctaLink ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      imageAlt: initialData?.imageAlt ?? "",
      order: initialData?.order ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedPage = watch("pageId") as PageId;
  const suggestedKeys = commonSectionKeys[selectedPage] || [];

  const onSubmit = (data: PageContentFormData) => {
    setError(null);
    startTransition(async () => {
      const result = initialData
        ? await updatePageContent(initialData.id, data)
        : await createPageContent(data);

      if (result.success) {
        router.push("/admin/content");
        router.refresh();
      } else {
        setError(result.error || "An error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Page" error={errors.pageId?.message} required>
              <select
                {...register("pageId")}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                disabled={!!initialData}
              >
                {pageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Section Key" error={errors.sectionKey?.message} required>
              <Input
                {...register("sectionKey")}
                placeholder="hero"
                error={!!errors.sectionKey}
                disabled={!!initialData}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier (lowercase, hyphens). Cannot be changed after creation.
              </p>
              {suggestedKeys.length > 0 && !initialData && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">Suggestions: </span>
                  {suggestedKeys.map(key => (
                    <span 
                      key={key} 
                      className="inline-block text-xs bg-muted px-1.5 py-0.5 rounded mr-1 font-mono"
                    >
                      {key}
                    </span>
                  ))}
                </div>
              )}
            </FormField>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Title" error={errors.title?.message}>
              <Input
                {...register("title")}
                placeholder="Section title (optional)"
              />
            </FormField>

            <FormField label="Subtitle" error={errors.subtitle?.message}>
              <Input
                {...register("subtitle")}
                placeholder="Section subtitle (optional)"
              />
            </FormField>
          </div>

          <FormField label="Body Content" error={errors.body?.message} required>
            <Textarea
              {...register("body")}
              placeholder="Main content for this section. Supports basic formatting..."
              rows={8}
              error={!!errors.body}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The main text content. Use line breaks for paragraphs.
            </p>
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium mb-4">Call to Action (Optional)</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="CTA Button Text" error={errors.ctaText?.message}>
            <Input
              {...register("ctaText")}
              placeholder="Learn More"
            />
          </FormField>

          <FormField label="CTA Link" error={errors.ctaLink?.message}>
            <Input
              {...register("ctaLink")}
              placeholder="/about or https://..."
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium mb-4">Settings</h3>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Order" error={errors.order?.message}>
              <Input
                type="number"
                {...register("order")}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first within the page
              </p>
            </FormField>

            <FormField label="Image URL (Optional)" error={errors.imageUrl?.message}>
              <Input
                {...register("imageUrl")}
                placeholder="https://..."
              />
            </FormField>
          </div>

          <Checkbox
            label="Active (visible on public site)"
            {...register("isActive")}
          />
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" loading={isPending}>
          {initialData ? "Update Content" : "Create Content"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
