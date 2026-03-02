"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  /** Vertical offset to start from (default 10px) */
  y?: number
  duration?: number
  className?: string
}

/** Subtle fade-in used inside app pages. Very gentle — y:10, 0.32s. */
export function FadeIn({ children, delay = 0, y = 10, duration = 0.32, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
