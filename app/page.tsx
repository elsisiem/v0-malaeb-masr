import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the welcome screen for new users
  redirect("/welcome")
}
