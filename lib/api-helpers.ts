import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/types/database"

export type UserRole = Database["public"]["Tables"]["profiles"]["Row"]["role"]

// ─── Response helpers ──────────────────────────────────────────────────────────

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, ...(details ? { details } : {}) }, { status })
}

// ─── Auth helpers ──────────────────────────────────────────────────────────────

/**
 * Returns the current authenticated Supabase user, or an error string.
 */
export async function getAuthUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, error: "Unauthorized" } as const
  }
  return { user, error: null } as const
}

/**
 * Returns the current user + their profile row. Enforces a required role if given.
 */
export async function getAuthUserWithProfile(requiredRole?: UserRole | UserRole[]) {
  const { user, error } = await getAuthUser()
  if (error || !user) return { user: null, profile: null, error: "Unauthorized" } as const

  const supabase = createClient()
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return { user: null, profile: null, error: "Profile not found" } as const
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(profile.role)) {
      return { user: null, profile: null, error: "Forbidden" } as const
    }
  }

  return { user, profile, error: null } as const
}

// ─── Pagination helper ─────────────────────────────────────────────────────────

export function getPagination(page: number, pageSize: number) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { from, to }
}

// ─── Notification helper ───────────────────────────────────────────────────────

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Database["public"]["Tables"]["notifications"]["Row"]["type"] = "general",
  data: Record<string, unknown> = {},
) {
  const supabase = createClient()
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    data: data as unknown as import("@/lib/types/database").Json,
  })
}
