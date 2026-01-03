"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  programSchema,
  type ProgramFormData,
} from "@/features/admin/schemas";
import {
  Card,
  FormField,
  Input,
  Textarea,
  Checkbox,
  Button,
} from "@/features/admin/components";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { createProgram, updateProgram } from "@/features/admin/actions/programs";
import type { Program } from "@prisma/client";

interface ProgramFormProps {
  program?: Program;
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter();
  const isEditing = !!program;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: program?.title || "",
      slug: program?.slug || "",
      description: program?.description || "",
      content: program?.content || "",
      imageUrl: program?.imageUrl || "",
      isActive: program?.isActive ?? true,
      isFeatured: program?.isFeatured ?? false,
      order: program?.order ?? 0,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: ProgramFormData) => {
    const result = isEditing
      ? await updateProgram(program.id, data)
      : await createProgram(data);

    if (result.success) {
      router.push("/admin/programs");
      router.refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    register("title").onChange(e);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <div className="space-y-4">
          <FormField label="Title" error={errors.title?.message} required>
            <Input
              {...register("title")}
              onChange={handleTitleChange}
              error={!!errors.title}
              placeholder="Community Outreach Program"
            />
          </FormField>

          <FormField label="Slug" error={errors.slug?.message} required>
            <Input
              {...register("slug")}
              error={!!errors.slug}
              placeholder="community-outreach-program"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message} required>
            <Textarea
              {...register("description")}
              error={!!errors.description}
              placeholder="Brief description of the program..."
            />
          </FormField>

          <FormField label="Content" error={errors.content?.message}>
            <Textarea
              {...register("content")}
              error={!!errors.content}
              placeholder="Detailed content about the program..."
              rows={8}
            />
          </FormField>

          <FormField label="Image URL" error={errors.imageUrl?.message}>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url)}
              placeholder="https://example.com/program-image.jpg"
            />
          </FormField>

          <FormField label="Display Order" error={errors.order?.message}>
            <Input
              type="number"
              {...register("order")}
              error={!!errors.order}
              className="w-24"
            />
          </FormField>

          <div className="flex gap-6">
            <Checkbox label="Published" {...register("isActive")} />
            <Checkbox label="Featured" {...register("isFeatured")} />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Update Program" : "Create Program"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/programs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
