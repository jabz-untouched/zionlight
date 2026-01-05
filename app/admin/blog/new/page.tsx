import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components";
import { BlogPostForm } from "../_components/blog-post-form";

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Create a new blog post.",
};

async function getData() {
  const [categories, tags] = await Promise.all([
    db.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    db.blogTag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return { categories, tags };
}

export default async function NewBlogPostPage() {
  const { categories, tags } = await getData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Blog Post"
        description="Create a new blog post."
      />
      <BlogPostForm categories={categories} tags={tags} />
    </div>
  );
}
