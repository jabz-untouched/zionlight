"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  galleryItemSchema,
  type GalleryItemFormData,
} from "@/features/admin/schemas";
import {
  Card,
  FormField,
  Input,
  Textarea,
  Checkbox,
  Button,
} from "@/features/admin/components";
import { ImageUpload, TagInput } from "@/features/admin/components/image-upload";
import { createGalleryItem, updateGalleryItem } from "@/features/admin/actions/gallery";
import type { GalleryItem } from "@prisma/client";

interface GalleryItemFormProps {
  item?: GalleryItem;
}

export function GalleryItemForm({ item }: GalleryItemFormProps) {
  const router = useRouter();
  const isEditing = !!item;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GalleryItemFormData>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      imageUrl: item?.imageUrl || "",
      thumbnailUrl: item?.thumbnailUrl || "",
      category: item?.category || "",
      tags: item?.tags || [],
      isActive: item?.isActive ?? true,
      isFeatured: item?.isFeatured ?? false,
      order: item?.order ?? 0,
      takenAt: item?.takenAt ? new Date(item.takenAt) : undefined,
    },
  });

  const imageUrl = watch("imageUrl");
  const thumbnailUrl = watch("thumbnailUrl");

  const onSubmit = async (data: GalleryItemFormData) => {
    const result = isEditing
      ? await updateGalleryItem(item.id, data)
      : await createGalleryItem(data);

    if (result.success) {
      router.push("/admin/gallery");
      router.refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <h3 className="mb-4 font-medium">Image Details</h3>
        <div className="space-y-4">
          <FormField label="Title" error={errors.title?.message} required>
            <Input
              {...register("title")}
              error={!!errors.title}
              placeholder="Community Event 2024"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <Textarea
              {...register("description")}
              error={!!errors.description}
              placeholder="Description of the image..."
            />
          </FormField>

          <FormField label="Image URL" error={errors.imageUrl?.message} required>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url)}
              placeholder="https://example.com/image.jpg"
            />
          </FormField>

          <FormField label="Thumbnail URL" error={errors.thumbnailUrl?.message}>
            <ImageUpload
              value={thumbnailUrl}
              onChange={(url) => setValue("thumbnailUrl", url)}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium">Categorization</h3>
        <div className="space-y-4">
          <FormField label="Category" error={errors.category?.message}>
            <Input
              {...register("category")}
              error={!!errors.category}
              placeholder="events, programs, community, etc."
            />
          </FormField>

          <FormField label="Tags" error={errors.tags?.message}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Add a tag..."
                />
              )}
            />
          </FormField>

          <FormField label="Date Taken" error={errors.takenAt?.message}>
            <Input
              type="date"
              {...register("takenAt")}
              error={!!errors.takenAt}
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium">Display Options</h3>
        <div className="space-y-4">
          <FormField label="Display Order" error={errors.order?.message}>
            <Input
              type="number"
              {...register("order")}
              error={!!errors.order}
              className="w-24"
            />
          </FormField>

          <div className="flex gap-6">
            <Checkbox label="Active" {...register("isActive")} />
            <Checkbox label="Featured" {...register("isFeatured")} />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/gallery")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
