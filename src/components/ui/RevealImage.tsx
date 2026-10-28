"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Fotografia que se abre de baixo para cima ao entrar na viewport, com um leve
 * recuo de escala. Com movimento reduzido, aparece sem animação.
 */
export function RevealImage({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(14% 0% 0% 0%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease }}
      className={`relative overflow-hidden bg-graphite ${className}`}
    >
      <motion.div
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.6, delay, ease }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
