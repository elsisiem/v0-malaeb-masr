import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * GET /api/payments/methods
 * List the authenticated user's saved payment methods.
 */
export async function GET() {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * POST /api/payments/methods
 * Save a new payment method (tokenised card from Paymob).
 * Body: { type, token, lastFour, expiry, name, isDefault }
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { type, token, lastFour, expiry, name, isDefault = false } = body

    if (!type || !["card", "wallet", "fawry"].includes(type)) {
      return errorResponse("Valid type (card | wallet | fawry) is required", 400)
    }

    const supabase = createClient()

    // If this is default, unset other defaults first
    if (isDefault) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    const { data, error } = await supabase
      .from("payment_methods")
      .insert({
        user_id: user.id,
        type,
        token: token ?? null,
        last_four: lastFour ?? null,
        expiry: expiry ?? null,
        name: name ?? null,
        is_default: isDefault,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data, 201)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
