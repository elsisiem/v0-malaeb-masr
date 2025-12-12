"use client"

import * as React from "react"
import { motion } from "framer-motion"

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = "", ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
})
AnimatedButton.displayName = "AnimatedButton"
