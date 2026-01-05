import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
} from "@/features/admin/components";
import { DeleteButton, ToggleButton } from "@/features/admin/components/actions";
import { deleteBlogPost, toggleBlogPostPublished } from "@/features/admin/actions/blog";
import { DEFAULT_LOCALE } from "@/features/admin/schemas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Manage blog posts and articles.",
};

async function getBlogPosts() {
  return db.blogPost.findMany({
    include: {
      translations: {
        where: { locale: DEFAULT_LOCALE },
        take: 1,
      },
      category: true,
      _count: {
        select: { tags: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogPostsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage blog posts and articles."
        action={{ label: "New Post", href: "/admin/blog/new" }}
      />

      <DataTable
        data={posts.map((post) => ({
          id: post.id,
          title: post.translations[0]?.title || "Untitled",
          slug: post.slug,
          category: post.category?.name || "—",
          tagCount: post._count.tags,
          isPublished: post.isPublished,
          isFeatured: post.isFeatured,
          publishedAt: post.publishedAt,
        }))}
        emptyMessage="No blog posts yet. Create your first post."
        columns={[
          {
            key: "title",
            label: "Title",
            render: (post) => (
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">/{post.slug}</p>
              </div>
            ),
          },
          {
            key: "category",
            label: "Category",
          },
          {
            key: "isPublished",
            label: "Status",
            render: (post) => (
              <StatusBadge
                active={post.isPublished}
                activeLabel="Published"
                inactiveLabel="Draft"
              />
            ),
          },
          {
            key: "isFeatured",
            label: "Featured",
            render: (post) => (post.isFeatured ? "Yes" : "—"),
          },
          {
            key: "publishedAt",
            label: "Published",
            render: (post) =>
              post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "—",
          },
          {
            key: "actions",
            label: "Actions",
            render: (post) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <ToggleButton
                  id={post.id}
                  isActive={post.isPublished}
                  onToggle={toggleBlogPostPublished}
                />
                <DeleteButton
                  id={post.id}
                  onDelete={deleteBlogPost}
                  itemName="post"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
