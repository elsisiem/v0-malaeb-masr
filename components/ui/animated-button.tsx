"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ children, className = "", ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
})
AnimatedButton.displayName = "AnimatedButton"
