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
      className={`py-16 md:py-24 ${bgClasses[background]} ${className}`}
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
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignClasses} ${className}`}>
      {subtitle && (
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Button - A versatile button component
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
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
    outline: "border-2 border-foreground/20 hover:border-primary hover:text-primary bg-transparent",
    ghost: "hover:bg-muted",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

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
 * Card - A styled card container
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
        ${hover ? "transition-all duration-300 hover:shadow-lg hover:border-border hover:-translate-y-1" : ""}
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
