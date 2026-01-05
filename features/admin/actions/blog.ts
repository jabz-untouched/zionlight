"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  blogPostWithTranslationSchema,
  blogCategorySchema,
  blogTagSchema,
  type BlogPostWithTranslationFormData,
  type BlogCategoryFormData,
  type BlogTagFormData,
  DEFAULT_LOCALE,
} from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

// ============================================
// BLOG CATEGORY ACTIONS
// ============================================

export async function createBlogCategory(data: BlogCategoryFormData): Promise<ActionResult> {
  try {
    const validated = blogCategorySchema.parse(data);

    const category = await db.blogCategory.create({
      data: {
        ...validated,
        description: validated.description || null,
      },
    });

    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");

    return { success: true, data: category };
  } catch (error) {
    console.error("Create blog category error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A category with this slug already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateBlogCategory(
  id: string,
  data: BlogCategoryFormData
): Promise<ActionResult> {
  try {
    const validated = blogCategorySchema.parse(data);

    const category = await db.blogCategory.update({
      where: { id },
      data: {
        ...validated,
        description: validated.description || null,
      },
    });

    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");

    return { success: true, data: category };
  } catch (error) {
    console.error("Update blog category error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteBlogCategory(id: string): Promise<ActionResult> {
  try {
    await db.blogCategory.delete({ where: { id } });

    revalidatePath("/admin/blog/categories");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog category error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete category" };
  }
}

// ============================================
// BLOG TAG ACTIONS
// ============================================

export async function createBlogTag(data: BlogTagFormData): Promise<ActionResult> {
  try {
    const validated = blogTagSchema.parse(data);

    const tag = await db.blogTag.create({ data: validated });

    revalidatePath("/admin/blog/tags");
    revalidatePath("/blog");

    return { success: true, data: tag };
  } catch (error) {
    console.error("Create blog tag error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A tag with this slug already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create tag" };
  }
}

export async function deleteBlogTag(id: string): Promise<ActionResult> {
  try {
    await db.blogTag.delete({ where: { id } });

    revalidatePath("/admin/blog/tags");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog tag error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete tag" };
  }
}

// ============================================
// BLOG POST ACTIONS
// ============================================

export async function createBlogPost(
  data: BlogPostWithTranslationFormData
): Promise<ActionResult> {
  try {
    const validated = blogPostWithTranslationSchema.parse(data);
    const { translation, tagIds, categoryId, ...postData } = validated;

    const post = await db.blogPost.create({
      data: {
        ...postData,
        featuredImage: postData.featuredImage || null,
        publishedAt: postData.isPublished ? (postData.publishedAt || new Date()) : null,
        categoryId: categoryId || null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map((id) => ({ id })),
        } : undefined,
        translations: {
          create: {
            locale: translation.locale || DEFAULT_LOCALE,
            title: translation.title,
            excerpt: translation.excerpt || null,
            content: translation.content,
            seoTitle: translation.seoTitle || null,
            seoDescription: translation.seoDescription || null,
          },
        },
      },
      include: {
        translations: true,
        category: true,
        tags: true,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true, data: post };
  } catch (error) {
    console.error("Create blog post error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A blog post with this slug already exists" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function updateBlogPost(
  id: string,
  data: BlogPostWithTranslationFormData
): Promise<ActionResult> {
  try {
    const validated = blogPostWithTranslationSchema.parse(data);
    const { translation, tagIds, categoryId, ...postData } = validated;

    // Update post and upsert translation
    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...postData,
        featuredImage: postData.featuredImage || null,
        publishedAt: postData.isPublished ? (postData.publishedAt || new Date()) : null,
        categoryId: categoryId || null,
        tags: {
          set: [], // Clear existing tags
          connect: tagIds && tagIds.length > 0 ? tagIds.map((tid) => ({ id: tid })) : [],
        },
      },
    });

    // Upsert translation
    await db.blogPostTranslation.upsert({
      where: {
        blogPostId_locale: {
          blogPostId: id,
          locale: translation.locale || DEFAULT_LOCALE,
        },
      },
      update: {
        title: translation.title,
        excerpt: translation.excerpt || null,
        content: translation.content,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
      create: {
        blogPostId: id,
        locale: translation.locale || DEFAULT_LOCALE,
        title: translation.title,
        excerpt: translation.excerpt || null,
        content: translation.content,
        seoTitle: translation.seoTitle || null,
        seoDescription: translation.seoDescription || null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, data: post };
  } catch (error) {
    console.error("Update blog post error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    await db.blogPost.delete({ where: { id } });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete blog post" };
  }
}

export async function toggleBlogPostPublished(id: string): Promise<ActionResult> {
  try {
    const post = await db.blogPost.findUnique({ where: { id } });

    if (!post) {
      return { success: false, error: "Blog post not found" };
    }

    const updated = await db.blogPost.update({
      where: { id },
      data: {
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date() : post.publishedAt,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle blog post published error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to toggle publish status" };
  }
}

// ============================================
// PUBLIC BLOG QUERIES
// ============================================

export async function getPublishedBlogPosts(
  locale: string = DEFAULT_LOCALE,
  options?: {
    limit?: number;
    offset?: number;
    categorySlug?: string;
    tagSlug?: string;
  }
) {
  try {
    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (options?.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    if (options?.tagSlug) {
      where.tags = { some: { slug: options.tagSlug } };
    }

    const posts = await db.blogPost.findMany({
      where,
      include: {
        translations: {
          where: { locale },
        },
        category: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    // Fallback to default locale if translation not found
    return posts.map((post) => {
      const translation = post.translations[0];
      return {
        ...post,
        translation,
      };
    });
  } catch (error) {
    console.error("Get published blog posts error:", error);
    return [];
  }
}

export async function getPublishedBlogPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE
) {
  try {
    const post = await db.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: {
        translations: true,
        category: true,
        tags: true,
      },
    });

    if (!post) return null;

    // Try to get translation for requested locale, fallback to default
    const translation =
      post.translations.find((t) => t.locale === locale) ||
      post.translations.find((t) => t.locale === DEFAULT_LOCALE) ||
      post.translations[0];

    return { ...post, translation };
  } catch (error) {
    console.error("Get blog post by slug error:", error);
    return null;
  }
}

export async function getBlogCategories() {
  try {
    return await db.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Get blog categories error:", error);
    return [];
  }
}

export async function getBlogTags() {
  try {
    return await db.blogTag.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Get blog tags error:", error);
    return [];
  }
}

export async function getFeaturedBlogPosts(locale: string = DEFAULT_LOCALE, limit: number = 3) {
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        translations: {
          where: { locale },
        },
        category: true,
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return posts.map((post) => ({
      ...post,
      translation: post.translations[0],
    }));
  } catch (error) {
    console.error("Get featured blog posts error:", error);
    return [];
  }
}

export async function countPublishedBlogPosts(options?: {
  categorySlug?: string;
  tagSlug?: string;
}) {
  try {
    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (options?.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    if (options?.tagSlug) {
      where.tags = { some: { slug: options.tagSlug } };
    }

    return await db.blogPost.count({ where });
  } catch (error) {
    console.error("Count published blog posts error:", error);
    return 0;
  }
}
