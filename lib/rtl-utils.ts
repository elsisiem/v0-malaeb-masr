export function isRTL(locale: string): boolean {
  return locale === "ar"
}

export function getTextAlign(locale: string): "left" | "right" {
  return isRTL(locale) ? "right" : "left"
}

export function getFlexDirection(locale: string, reverse?: boolean): string {
  const isRtl = isRTL(locale)
  if (reverse) {
    return isRtl ? "flex-row" : "flex-row-reverse"
  }
  return isRtl ? "flex-row-reverse" : "flex-row"
}
