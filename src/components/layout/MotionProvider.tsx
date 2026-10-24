"use client";

import { MotionConfig } from "motion/react";

/** Respeita prefers-reduced-motion em todas as animações do Motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}>
      {children}
    </MotionConfig>
  );
}
