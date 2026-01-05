import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section, Container, Card } from "@/components/ui";
import { MotionDiv } from "@/components/ui";
import { ArticleJsonLd } from "@/components/seo";
import { AnalyticsTracker } from "@/components/analytics";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/features/admin/actions/blog";
import { DEFAULT_LOCALE } from "@/features/admin/schemas";
import { generateArticleMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug, DEFAULT_LOCALE);

  if (!post || !post.translation) {
    return {
      title: "Post Not Found",
    };
  }

  return generateArticleMetadata({
    title: post.translation.title,
    excerpt: post.translation.excerpt,
    seoTitle: post.translation.seoTitle,
    seoDescription: post.translation.seoDescription,
    featuredImage: post.featuredImage,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.category,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug, DEFAULT_LOCALE);

  if (!post || !post.translation) {
    notFound();
  }

  // Get related posts (same category or random)
  const relatedPosts = await getPublishedBlogPosts(DEFAULT_LOCALE, {
    limit: 3,
    categorySlug: post.category?.slug,
  });
  const filteredRelated = relatedPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      {/* Structured Data */}
      <ArticleJsonLd
        title={post.translation.title}
        description={post.translation.excerpt || undefined}
        slug={post.slug}
        featuredImage={post.featuredImage}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
      
      {/* Analytics tracking */}
      <AnalyticsTracker
        type="blog"
        slug={post.slug}
        title={post.translation.title}
        category={post.category?.name}
      />

      {/* Hero */}
      <Section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
        <Container className="max-w-4xl">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Blog
            </Link>

            {post.category && (
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                {post.category.name}
              </span>
            )}

            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {post.translation.title}
            </h1>

            {post.translation.excerpt && (
              <p className="mb-6 text-xl text-muted-foreground">
                {post.translation.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-muted px-3 py-1 text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </MotionDiv>
        </Container>
      </Section>

      {/* Featured Image */}
      {post.featuredImage && (
        <Section className="py-0">
          <Container className="max-w-5xl">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-video overflow-hidden rounded-xl"
            >
              <Image
                src={post.featuredImage}
                alt={post.translation.title}
                fill
                className="object-cover"
                priority
              />
            </MotionDiv>
          </Container>
        </Section>
      )}

      {/* Content */}
      <Section className="py-12 lg:py-16">
        <Container className="max-w-3xl">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg mx-auto dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatContent(post.translation.content) }}
          />
        </Container>
      </Section>

      {/* Related Posts */}
      {filteredRelated.length > 0 && (
        <Section className="border-t bg-muted/30 py-16">
          <Container>
            <h2 className="mb-8 text-center text-2xl font-bold">Related Posts</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {filteredRelated.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {relatedPost.featuredImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.translation?.title || "Blog post"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
                        {relatedPost.translation?.title || "Untitled"}
                      </h3>
                      {relatedPost.publishedAt && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {new Date(relatedPost.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

// Simple content formatter - converts line breaks to paragraphs
function formatContent(content: string): string {
  // Split by double newlines to create paragraphs
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
