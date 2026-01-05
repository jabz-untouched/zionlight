"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  blogPostWithTranslationSchema,
  type BlogPostWithTranslationFormData,
  DEFAULT_LOCALE,
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
import { createBlogPost, updateBlogPost } from "@/features/admin/actions/blog";
import type { BlogPost, BlogPostTranslation, BlogCategory, BlogTag } from "@prisma/client";

interface BlogPostFormProps {
  post?: BlogPost & {
    translations: BlogPostTranslation[];
    tags: BlogTag[];
  };
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogPostForm({ post, categories, tags }: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  // Get the default locale translation
  const translation = post?.translations.find((t) => t.locale === DEFAULT_LOCALE);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostWithTranslationFormData>({
    resolver: zodResolver(blogPostWithTranslationSchema),
    defaultValues: {
      slug: post?.slug || "",
      featuredImage: post?.featuredImage || "",
      isPublished: post?.isPublished ?? false,
      isFeatured: post?.isFeatured ?? false,
      publishedAt: post?.publishedAt?.toISOString().split("T")[0] || "",
      categoryId: post?.categoryId || "",
      tagIds: post?.tags.map((t) => t.id) || [],
      translation: {
        locale: DEFAULT_LOCALE,
        title: translation?.title || "",
        excerpt: translation?.excerpt || "",
        content: translation?.content || "",
        seoTitle: translation?.seoTitle || "",
        seoDescription: translation?.seoDescription || "",
      },
    },
  });

  const featuredImage = watch("featuredImage");
  const selectedTagIds = watch("tagIds") || [];

  const onSubmit = async (data: BlogPostWithTranslationFormData) => {
    // Convert publishedAt string to Date if present and valid
    const submissionData = {
      ...data,
      publishedAt: data.publishedAt && typeof data.publishedAt === 'string' 
        ? new Date(data.publishedAt) 
        : data.publishedAt instanceof Date 
          ? data.publishedAt 
          : undefined,
    };

    const result = isEditing
      ? await updateBlogPost(post.id, submissionData)
      : await createBlogPost(submissionData);

    if (result.success) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("translation.title", title);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds || [];
    if (current.includes(tagId)) {
      setValue("tagIds", current.filter((id) => id !== tagId));
    } else {
      setValue("tagIds", [...current, tagId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Post Details</h2>
        <div className="space-y-4">
          <FormField
            label="Title"
            error={errors.translation?.title?.message}
            required
          >
            <Input
              value={watch("translation.title")}
              onChange={handleTitleChange}
              error={!!errors.translation?.title}
              placeholder="My Amazing Blog Post"
            />
          </FormField>

          <FormField label="Slug" error={errors.slug?.message} required>
            <Input
              {...register("slug")}
              error={!!errors.slug}
              placeholder="my-amazing-blog-post"
            />
          </FormField>

          <FormField
            label="Excerpt"
            error={errors.translation?.excerpt?.message}
          >
            <Textarea
              {...register("translation.excerpt")}
              error={!!errors.translation?.excerpt}
              placeholder="A brief summary of the post..."
              rows={3}
            />
          </FormField>

          <FormField
            label="Content"
            error={errors.translation?.content?.message}
            required
          >
            <Textarea
              {...register("translation.content")}
              error={!!errors.translation?.content}
              placeholder="Write your blog post content here..."
              rows={12}
            />
          </FormField>

          <FormField label="Featured Image" error={errors.featuredImage?.message}>
            <ImageUpload
              value={featuredImage}
              onChange={(url) => setValue("featuredImage", url)}
              placeholder="https://example.com/blog-image.jpg"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Category" error={errors.categoryId?.message}>
              <select
                {...register("categoryId")}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Publish Date" error={errors.publishedAt?.message}>
              <Input
                type="date"
                {...register("publishedAt")}
                error={!!errors.publishedAt}
              />
            </FormField>
          </div>

          {tags.length > 0 && (
            <FormField label="Tags">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </FormField>
          )}

          <div className="flex gap-6">
            <Checkbox label="Published" {...register("isPublished")} />
            <Checkbox label="Featured" {...register("isFeatured")} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">SEO Settings</h2>
        <div className="space-y-4">
          <FormField
            label="SEO Title"
            error={errors.translation?.seoTitle?.message}
          >
            <Input
              {...register("translation.seoTitle")}
              error={!!errors.translation?.seoTitle}
              placeholder="Custom SEO title (defaults to post title)"
            />
          </FormField>

          <FormField
            label="SEO Description"
            error={errors.translation?.seoDescription?.message}
          >
            <Textarea
              {...register("translation.seoDescription")}
              error={!!errors.translation?.seoDescription}
              placeholder="Meta description for search engines..."
              rows={3}
            />
          </FormField>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
