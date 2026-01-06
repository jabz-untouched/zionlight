import { type ReactNode } from "react";
import Link from "next/link";

/**
 * Section - A wrapper for page sections with consistent padding
 */
interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "primary" | "secondary";
}

export function Section({ 
  children, 
  className = "", 
  id,
  background = "default" 
}: SectionProps) {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-muted/50",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <section 
      id={id}
      className={`py-12 sm:py-16 md:py-24 ${bgClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Container - A centered container with consistent max-width
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "xl" | "full";
}

export function Container({ 
  children, 
  className = "",
  size = "default"
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-6xl",
    lg: "max-w-7xl",
    xl: "max-w-[1400px]",
    full: "max-w-none",
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * SectionHeader - Consistent header for page sections
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle,
  description,
  align = "center",
  className = ""
}: SectionHeaderProps) {
  const alignClasses = align === "center" 
    ? "text-center mx-auto" 
    : "text-left";

  return (
    <div className={`max-w-3xl mb-8 sm:mb-12 md:mb-16 ${alignClasses} ${className}`}>
      {subtitle && (
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-primary mb-2 sm:mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Button - A versatile button component with mobile-first touch targets
 */
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  fullWidthMobile?: boolean;
}

export function Button({ 
  children, 
  variant = "primary",
  size = "md",
  href,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  fullWidthMobile = false,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-action-manipulation";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90 active:opacity-80",
    outline: "border-2 border-foreground/20 hover:border-primary hover:text-primary active:bg-primary/5 bg-transparent",
    ghost: "hover:bg-muted active:bg-muted/80",
  };

  // Mobile-first sizing with minimum 44px touch targets
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm min-h-[44px]",
    md: "px-5 py-3 text-base min-h-[44px] sm:px-6",
    lg: "px-6 py-3.5 text-base min-h-[48px] sm:px-8 sm:py-4 sm:text-lg",
  };

  const mobileFullWidth = fullWidthMobile ? "w-full sm:w-auto" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${mobileFullWidth} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={classes} 
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/**
 * Card - A styled card container with mobile optimization
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div 
      className={`
        bg-background rounded-xl border border-border/50 overflow-hidden
        ${hover ? "transition-all duration-300 hover:shadow-lg hover:border-border sm:hover:-translate-y-1 active:scale-[0.98]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Badge - A small label/tag component
 */
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline";
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default",
  className = "" 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    outline: "border border-border bg-transparent",
  };

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Divider - A horizontal divider
 */
interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return (
    <hr className={`border-t border-border/50 ${className}`} />
  );
}
