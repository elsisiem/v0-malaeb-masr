import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n/config"

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
}
