"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Motion Provider
 * Wraps the application with LazyMotion for optimized animation loading
 * Uses domAnimation for essential features with minimal bundle size
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
