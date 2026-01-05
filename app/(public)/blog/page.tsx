import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Section, 
  Container, 
  SectionHeader, 
  Card 
} from "@/components/ui";
import { 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui";
import { getPublishedBlogPosts, getBlogCategories, countPublishedBlogPosts } from "@/features/admin/actions/blog";
import { DEFAULT_LOCALE } from "@/features/admin/schemas";
import { generateMetadata as generateSEO, DEFAULT_SEO } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generateSEO({
  title: "Blog",
  description: "Read our latest stories, insights, and updates from the Zionlight Family Foundation community.",
  canonicalUrl: `${DEFAULT_SEO.siteUrl}/blog`,
});

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const currentPage = parseInt(params.page || "1", 10);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, categories, totalPosts] = await Promise.all([
    getPublishedBlogPosts(DEFAULT_LOCALE, {
      limit: POSTS_PER_PAGE,
      offset,
      categorySlug,
    }),
    getBlogCategories(),
    countPublishedBlogPosts({ categorySlug }),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <Container>
          <SectionHeader
            title="Blog"
            description="Stories, insights, and updates from our community"
            align="center"
          />
        </Container>
      </Section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <Section className="border-b bg-background py-4">
          <Container>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !categorySlug
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Blog Posts Grid */}
      <Section className="py-16">
        <Container>
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No posts found. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <StaggerItem key={post.id}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                        {post.featuredImage && (
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={post.featuredImage}
                              alt={post.translation?.title || "Blog post"}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post.category && (
                            <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-primary">
                              {post.category.name}
                            </span>
                          )}
                          <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                            {post.translation?.title || "Untitled"}
                          </h2>
                          {post.translation?.excerpt && (
                            <p className="mb-4 line-clamp-2 text-muted-foreground">
                              {post.translation.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            {post.publishedAt && (
                              <time dateTime={post.publishedAt.toISOString()}>
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </time>
                            )}
                            {post.tags.length > 0 && (
                              <span>{post.tags.length} tags</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/blog?${categorySlug ? `category=${categorySlug}&` : ""}page=${currentPage - 1}`}
                      className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="px-4 py-2 text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link
                      href={`/blog?${categorySlug ? `category=${categorySlug}&` : ""}page=${currentPage + 1}`}
                      className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
