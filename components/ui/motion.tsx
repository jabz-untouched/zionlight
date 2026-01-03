"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { forwardRef, type ReactNode } from "react";

// Cubic bezier for smooth animations
const easeOutExpo: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * Motion variants for consistent animations
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo }
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo }
  },
};

/**
 * MotionSection - A section wrapper with scroll-triggered animation
 */
interface MotionSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, className = "", delay = 0, ...props }, ref) => {
    const sectionVariants: Variants = {
      hidden: { opacity: 0, y: 32 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.7, 
          ease: easeOutExpo,
          delay 
        },
      },
    };

    return (
      <motion.section
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className={className}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
);

MotionSection.displayName = "MotionSection";

/**
 * MotionDiv - A div wrapper with scroll-triggered animation
 */
interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn";
}

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className = "", delay = 0, variant = "fadeInUp", ...props }, ref) => {
    const getVariants = (): Variants => {
      switch (variant) {
        case "fadeIn":
          return {
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { duration: 0.5, ease: "easeOut", delay }
            },
          };
        case "scaleIn":
          return {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.5, ease: easeOutExpo, delay }
            },
          };
        case "fadeInUp":
        default:
          return {
            hidden: { opacity: 0, y: 24 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, ease: easeOutExpo, delay }
            },
          };
      }
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={getVariants()}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionDiv.displayName = "MotionDiv";

/**
 * StaggerContainer - Container for staggered child animations
 */
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className = "", staggerDelay = 0.1, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: 0.1,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = "StaggerContainer";

/**
 * StaggerItem - Child item for StaggerContainer
 */
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = "StaggerItem";
