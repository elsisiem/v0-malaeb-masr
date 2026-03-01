import { cn } from "@/lib/utils"
import type { SVGProps } from "react"

export type SportKey =
  | "football"
  | "tennis"
  | "basketball"
  | "volleyball"
  | "squash"
  | "padel"
  | "swimming"
  | "gym"

// ─── Minimal sport SVG icons ──────────────────────────────────────────────────

function FootballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,7 14.5,9.5 13.5,13 10.5,13 9.5,9.5" fill="currentColor" stroke="none" opacity="0.9" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="3.9" y1="7.5" x2="7.2" y2="9.2" />
      <line x1="20.1" y1="7.5" x2="16.8" y2="9.2" />
      <line x1="5.4" y1="18.5" x2="8.5" y2="16" />
      <line x1="18.6" y1="18.5" x2="15.5" y2="16" />
      <line x1="12" y1="21" x2="12" y2="17" />
    </svg>
  )
}

function TennisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5 C6 9.5 9 7 9 3.5" />
      <path d="M20.5 9.5 C18 9.5 15 7 15 3.5" />
      <path d="M3.5 14.5 C6 14.5 9 17 9 20.5" />
      <path d="M20.5 14.5 C18 14.5 15 17 15 20.5" />
    </svg>
  )
}

function BasketballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 L12 21" />
      <path d="M3 12 L21 12" />
      <path d="M5 6.5 C8 8.5 8 15.5 5 17.5" />
      <path d="M19 6.5 C16 8.5 16 15.5 19 17.5" />
    </svg>
  )
}

function VolleyballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 C12 7 17 10 21 10" />
      <path d="M3 14 C6 14 9 17 9 21" />
      <path d="M3.5 9 C5.5 11.5 5.5 15.5 3.5 18" />
      <path d="M20.5 6 C18.5 9 18.5 14 20.5 17" />
    </svg>
  )
}

function SquashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="8" r="5" />
      <line x1="11.5" y1="11.5" x2="21" y2="21" strokeWidth="2.5" />
      <line x1="18" y1="21" x2="21" y2="18" />
    </svg>
  )
}

function PadelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="9" rx="7" ry="8" />
      <line x1="12" y1="17" x2="12" y2="22" strokeWidth="2.5" />
      <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SwimmingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <path d="M2 12 C4 10 6 14 8 12 C10 10 12 14 14 12 C16 10 18 14 20 12 C21 11 22 11.5 22 12" />
      <path d="M2 17 C4 15 6 19 8 17 C10 15 12 19 14 17 C16 15 18 19 20 17 C21 16 22 16.5 22 17" />
      <circle cx="12" cy="6" r="2" />
      <path d="M10 8 L8 12" />
      <path d="M14 8 L16 10" />
    </svg>
  )
}

function GymIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="10" width="4" height="4" rx="1" />
      <rect x="18" y="10" width="4" height="4" rx="1" />
      <rect x="5" y="8" width="3" height="8" rx="1" />
      <rect x="16" y="8" width="3" height="8" rx="1" />
      <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2.5" />
    </svg>
  )
}

function DefaultSportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 L12 12 L15 15" />
    </svg>
  )
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface SportMeta {
  label: string
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  chipClass: string
  iconColor: string
}

const SPORT_META: Record<string, SportMeta> = {
  football: {
    label: "Football",
    Icon: FootballIcon,
    iconColor: "text-emerald-700 dark:text-emerald-400",
    chipClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
  tennis: {
    label: "Tennis",
    Icon: TennisIcon,
    iconColor: "text-yellow-700 dark:text-yellow-400",
    chipClass:
      "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800",
  },
  basketball: {
    label: "Basketball",
    Icon: BasketballIcon,
    iconColor: "text-orange-700 dark:text-orange-400",
    chipClass:
      "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
  },
  volleyball: {
    label: "Volleyball",
    Icon: VolleyballIcon,
    iconColor: "text-blue-700 dark:text-blue-400",
    chipClass:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  squash: {
    label: "Squash",
    Icon: SquashIcon,
    iconColor: "text-amber-700 dark:text-amber-400",
    chipClass:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  padel: {
    label: "Padel",
    Icon: PadelIcon,
    iconColor: "text-pink-700 dark:text-pink-400",
    chipClass:
      "bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800",
  },
  swimming: {
    label: "Swimming",
    Icon: SwimmingIcon,
    iconColor: "text-cyan-700 dark:text-cyan-400",
    chipClass:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800",
  },
  gym: {
    label: "Gym",
    Icon: GymIcon,
    iconColor: "text-purple-700 dark:text-purple-400",
    chipClass:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  },
}

const FALLBACK: SportMeta = {
  label: "Sport",
  Icon: DefaultSportIcon,
  iconColor: "text-gray-600 dark:text-gray-400",
  chipClass:
    "bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700",
}

/** Bare SVG icon — drop-in replacement for the old emoji span */
export function SportEmoji({
  sport,
  className,
}: {
  sport: string
  className?: string
}) {
  const meta = SPORT_META[sport] ?? FALLBACK
  return (
    <meta.Icon
      aria-label={meta.label}
      className={cn("w-5 h-5 shrink-0", meta.iconColor, className)}
    />
  )
}

/** Colored pill badge for venue cards */
export function SportBadge({
  sport,
  className,
}: {
  sport: string
  className?: string
}) {
  const meta = SPORT_META[sport] ?? FALLBACK
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        meta.chipClass,
        className,
      )}
    >
      <meta.Icon aria-label={meta.label} className="w-3.5 h-3.5 shrink-0" />
      <span>{meta.label}</span>
    </span>
  )
}

/** Returns a sport's display label */
export function getSportLabel(sport: string): string {
  return (SPORT_META[sport] ?? FALLBACK).label
}
