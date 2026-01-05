"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  managedImageSchema, 
  type ManagedImageFormData,
  type ImageContext,
  type TextPosition 
} from "@/features/admin/schemas";
import { 
  createManagedImage, 
  updateManagedImage 
} from "@/features/admin/actions/managed-images";
import { 
  FormField, 
  Input, 
  Textarea, 
  Checkbox, 
  Button, 
  Card 
} from "@/features/admin/components/ui";
import { ImageUpload } from "@/features/admin/components/image-upload";

interface ManagedImageFormProps {
  initialData?: {
    id: string;
    key: string;
    title: string;
    description: string | null;
    altText: string | null;
    imageUrl: string;
    context: ImageContext;
    position: TextPosition;
    isActive: boolean;
    order: number;
  };
}

const contextOptions: { value: ImageContext; label: string; description: string }[] = [
  { value: "HERO", label: "Hero", description: "Hero section images (one active at a time)" },
  { value: "HOME", label: "Home", description: "Homepage feature images" },
  { value: "GLOBAL", label: "Global", description: "Global placeholders and fallbacks" },
];

const positionOptions: { value: TextPosition; label: string }[] = [
  { value: "LEFT", label: "Left" },
  { value: "CENTER", label: "Center" },
  { value: "RIGHT", label: "Right" },
];

export function ManagedImageForm({ initialData }: ManagedImageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ManagedImageFormData>({
    resolver: zodResolver(managedImageSchema),
    defaultValues: {
      key: initialData?.key ?? "",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      altText: initialData?.altText ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      context: initialData?.context ?? "HOME",
      position: initialData?.position ?? "CENTER",
      isActive: initialData?.isActive ?? true,
      order: initialData?.order ?? 0,
    },
  });

  const imageUrl = watch("imageUrl");
  const selectedContext = watch("context");

  const onSubmit = (data: ManagedImageFormData) => {
    setError(null);
    startTransition(async () => {
      const result = initialData
        ? await updateManagedImage(initialData.id, data)
        : await createManagedImage(data);

      if (result.success) {
        router.push("/admin/media");
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
            <FormField 
              label="Key" 
              error={errors.key?.message}
              required
            >
              <Input
                {...register("key")}
                placeholder="home-hero"
                error={!!errors.key}
                disabled={!!initialData}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier (lowercase, hyphens only). Cannot be changed after creation.
              </p>
            </FormField>

            <FormField 
              label="Title" 
              error={errors.title?.message}
              required
            >
              <Input
                {...register("title")}
                placeholder="Homepage Hero Image"
                error={!!errors.title}
              />
            </FormField>
          </div>

          <FormField label="Description" error={errors.description?.message}>
            <Textarea
              {...register("description")}
              placeholder="Internal description for this image..."
            />
          </FormField>

          <FormField label="Alt Text" error={errors.altText?.message}>
            <Input
              {...register("altText")}
              placeholder="Descriptive text for accessibility"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used for screen readers and SEO
            </p>
          </FormField>

          <FormField 
            label="Image URL" 
            error={errors.imageUrl?.message}
            required
          >
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url)}
              placeholder="https://example.com/image.jpg"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium mb-4">Image Settings</h3>
        <div className="space-y-6">
          <FormField label="Context" error={errors.context?.message} required>
            <div className="space-y-2">
              {contextOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedContext === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("context")}
                    value={option.value}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          {selectedContext === "HERO" && (
            <FormField label="Text Position" error={errors.position?.message}>
              <div className="flex gap-4">
                {positionOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register("position")}
                      value={option.value}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Position of overlay text on hero image
              </p>
            </FormField>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Order" error={errors.order?.message}>
              <Input
                type="number"
                {...register("order")}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </FormField>
          </div>

          <Checkbox
            label="Active (visible on public site)"
            {...register("isActive")}
          />
          
          {selectedContext === "HERO" && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Only one HERO image can be active at a time. Activating this will deactivate others.
            </p>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" loading={isPending}>
          {initialData ? "Update Image" : "Create Image"}
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
