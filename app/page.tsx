import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect to English welcome page by default
  redirect("/en/welcome")
}
