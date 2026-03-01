import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[62vh] w-full overflow-hidden">
        <Image
          src="/images/soccer4.jpg"
          alt="Sports facility"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Multi-stop gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />

        {/* App logo / name in top-left */}
        <div className="absolute top-12 left-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-lg leading-none">M</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight drop-shadow">Malaeb Masr</span>
          </div>
        </div>

        {/* Sport emoji row for visual flair */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4">
          {["⚽", "🎾", "🏀", "🏊", "🏋️"].map((emoji) => (
            <div
              key={emoji}
              className="h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-md border border-white/20"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Egypt's #1 Sports Booking App
          </div>
          <h1 className="text-[2rem] font-bold tracking-tight leading-tight">
            Find &amp; book sports venues instantly
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Discover football pitches, tennis courts, gyms and more — book in seconds, play right away.
          </p>
        </div>

        <div className="space-y-3 mt-8">
          <Button asChild className="w-full h-12 text-base font-semibold" size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 text-base" size="lg">
            <Link href="/auth/register">Create an account</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-between text-muted-foreground" size="lg" asChild>
            <Link href="/dashboard">
              Continue as guest
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
