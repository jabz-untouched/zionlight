import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components";
import { BlogPostForm } from "../../_components/blog-post-form";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit blog post details.",
};

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: string) {
  const [post, categories, tags] = await Promise.all([
    db.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
        tags: true,
      },
    }),
    db.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    db.blogTag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return { post, categories, tags };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const { post, categories, tags } = await getData(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Blog Post"
        description={`Editing: ${post.translations[0]?.title || post.slug}`}
      />
      <BlogPostForm post={post} categories={categories} tags={tags} />
    </div>
  );
}
