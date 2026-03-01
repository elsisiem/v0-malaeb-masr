"use client"

import * as React from "react"

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`transition-transform duration-100 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
AnimatedButton.displayName = "AnimatedButton"
