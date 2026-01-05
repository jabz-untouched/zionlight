/**
 * Content Components
 * Reusable components for rendering dynamic page content
 */

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui";
import { MotionDiv } from "@/components/ui";

interface PageSectionData {
  id: string;
  pageId: string;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  body: string;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  order: number;
  isActive: boolean;
}

interface ContentBlockProps {
  content: PageSectionData | null;
  fallbackTitle?: string;
  fallbackBody?: string;
  className?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showCta?: boolean;
  titleClassName?: string;
  bodyClassName?: string;
  animated?: boolean;
}

/**
 * ContentBlock - Renders a single content section with optional CTA
 */
export function ContentBlock({
  content,
  fallbackTitle,
  fallbackBody,
  className,
  showTitle = true,
  showSubtitle = true,
  showCta = true,
  titleClassName,
  bodyClassName,
  animated = false,
}: ContentBlockProps) {
  const title = content?.title || fallbackTitle;
  const body = content?.body || fallbackBody;
  
  if (!body) return null;

  const Wrapper = animated ? MotionDiv : "div";

  return (
    <Wrapper className={cn("space-y-4", className)}>
      {showTitle && title && (
        <h2 className={cn("text-3xl md:text-4xl font-bold", titleClassName)}>
          {title}
        </h2>
      )}
      {showSubtitle && content?.subtitle && (
        <p className="text-lg text-muted-foreground">{content.subtitle}</p>
      )}
      <div className={cn("text-muted-foreground leading-relaxed", bodyClassName)}>
        {body.split("\n\n").map((paragraph, i) => (
          <p key={i} className={i > 0 ? "mt-4" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
      {showCta && content?.ctaText && content?.ctaLink && (
        <div className="mt-6">
          <Button href={content.ctaLink}>{content.ctaText}</Button>
        </div>
      )}
    </Wrapper>
  );
}

interface HeroContentProps {
  content: PageSectionData | null;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackBody?: string;
  badge?: string;
  className?: string;
}

/**
 * HeroContent - Renders hero section text content
 */
export function HeroContent({
  content,
  fallbackTitle,
  fallbackSubtitle,
  fallbackBody,
  badge,
  className,
}: HeroContentProps) {
  const title = content?.title || fallbackTitle || "Welcome";
  const subtitle = content?.subtitle || fallbackSubtitle;
  const body = content?.body || fallbackBody;

  return (
    <div className={cn("max-w-3xl", className)}>
      {badge && (
        <MotionDiv variant="fadeInUp">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            {badge}
          </span>
        </MotionDiv>
      )}
      <MotionDiv variant="fadeInUp" delay={0.1}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {title}
        </h1>
      </MotionDiv>
      {(subtitle || body) && (
        <MotionDiv variant="fadeInUp" delay={0.2}>
          {subtitle && (
            <p className="text-2xl md:text-3xl font-medium text-primary mb-4">
              {subtitle}
            </p>
          )}
          {body && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {body}
            </p>
          )}
        </MotionDiv>
      )}
      {content?.ctaText && content?.ctaLink && (
        <MotionDiv variant="fadeInUp" delay={0.3} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Button href={content.ctaLink} size="lg">
            {content.ctaText}
          </Button>
        </MotionDiv>
      )}
    </div>
  );
}

interface QuoteBlockProps {
  content: PageSectionData | null;
  fallbackQuote?: string;
  fallbackAttribution?: string;
  className?: string;
}

/**
 * QuoteBlock - Renders a blockquote style content
 */
export function QuoteBlock({
  content,
  fallbackQuote,
  fallbackAttribution,
  className,
}: QuoteBlockProps) {
  const quote = content?.body || fallbackQuote;
  const attribution = content?.title || fallbackAttribution;

  if (!quote) return null;

  return (
    <div className={cn("max-w-4xl mx-auto text-center", className)}>
      <MotionDiv>
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-foreground/90">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {attribution && (
          <cite className="mt-6 block text-muted-foreground font-medium">
            — {attribution}
          </cite>
        )}
      </MotionDiv>
    </div>
  );
}

interface ValueCardData {
  letter: string;
  word: string;
  description: string;
}

interface ValuesGridProps {
  values: ValueCardData[];
  className?: string;
}

/**
 * ValuesGrid - Renders a grid of value cards (for HEMER values)
 */
export function ValuesGrid({ values, className }: ValuesGridProps) {
  return (
    <div className={cn("grid sm:grid-cols-2 lg:grid-cols-5 gap-6", className)}>
      {values.map((value, index) => (
        <MotionDiv key={value.letter} delay={index * 0.1}>
          <div className="p-6 text-center h-full rounded-xl border bg-card">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{value.letter}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{value.word}</h3>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
}

/**
 * Stat item for impact stats
 */
interface StatData {
  number: string;
  label: string;
}

interface StatsGridProps {
  stats: StatData[];
  className?: string;
}

/**
 * StatsGrid - Renders impact statistics
 */
export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-8 text-center", className)}>
      {stats.map((stat, index) => (
        <MotionDiv key={stat.label} delay={index * 0.1}>
          <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
          <div className="text-inherit/80">{stat.label}</div>
        </MotionDiv>
      ))}
    </div>
  );
}
