import { cn } from "@/lib/utils"

export type SportKey =
  | "football"
  | "tennis"
  | "basketball"
  | "volleyball"
  | "squash"
  | "padel"
  | "swimming"
  | "gym"

interface SportMeta {
  emoji: string
  label: string
  chipClass: string
}

const SPORT_META: Record<string, SportMeta> = {
  football: {
    emoji: "⚽",
    label: "Football",
    chipClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
  tennis: {
    emoji: "🎾",
    label: "Tennis",
    chipClass:
      "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800",
  },
  basketball: {
    emoji: "🏀",
    label: "Basketball",
    chipClass:
      "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
  },
  volleyball: {
    emoji: "🏐",
    label: "Volleyball",
    chipClass:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  squash: {
    emoji: "🎱",
    label: "Squash",
    chipClass:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  padel: {
    emoji: "🏓",
    label: "Padel",
    chipClass:
      "bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800",
  },
  swimming: {
    emoji: "🏊",
    label: "Swimming",
    chipClass:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800",
  },
  gym: {
    emoji: "🏋️",
    label: "Gym",
    chipClass:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  },
}

const FALLBACK: SportMeta = {
  emoji: "🏟️",
  label: "Sport",
  chipClass:
    "bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700",
}

/** Bare emoji span — drop-in replacement for the bad Lucide aliases */
export function SportEmoji({
  sport,
  className,
}: {
  sport: string
  className?: string
}) {
  const meta = SPORT_META[sport] ?? FALLBACK
  return (
    <span role="img" aria-label={meta.label} className={cn("leading-none select-none", className)}>
      {meta.emoji}
    </span>
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
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        meta.chipClass,
        className,
      )}
    >
      <span role="img" aria-label={meta.label} className="leading-none">
        {meta.emoji}
      </span>
      <span>{meta.label}</span>
    </span>
  )
}

/** Returns a sport's display label */
export function getSportLabel(sport: string): string {
  return (SPORT_META[sport] ?? FALLBACK).label
}
