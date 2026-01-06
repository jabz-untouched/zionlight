"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close menu on escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group z-50">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src="/logo.png"
              alt="Zionlight Family Foundation"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-semibold text-base md:text-lg hidden sm:block group-hover:text-primary transition-colors">
            Zionlight Family Foundation
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/" && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-sm font-medium transition-colors hover:text-primary py-2
                  ${isActive ? "text-primary" : "text-foreground/80"}
                `}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button - 44px minimum touch target */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 z-50"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span 
              className={`w-full h-0.5 bg-foreground transition-all duration-300 origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
              }`} 
            />
            <span 
              className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0 scale-0" : ""
              }`} 
            />
            <span 
              className={`w-full h-0.5 bg-foreground transition-all duration-300 origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
              }`} 
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border md:hidden z-40 pt-20"
            >
              <div className="flex flex-col h-full px-6 py-6 overflow-y-auto">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href || 
                      (link.href !== "/" && pathname.startsWith(link.href));
                    
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center min-h-[48px] px-4 py-3 rounded-xl font-medium text-lg transition-colors
                            ${isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted active:bg-muted/80"
                            }
                          `}
                        >
                          {link.label}
                          {isActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
                
                {/* Optional: Social or CTA at bottom */}
                <div className="mt-auto pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    Building bridges of hope
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
