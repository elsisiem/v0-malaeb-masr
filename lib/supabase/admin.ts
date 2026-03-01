import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

/**
 * Admin client with service role key — bypasses RLS.
 * NEVER expose this on the client side.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
