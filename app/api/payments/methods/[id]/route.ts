import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser, successResponse, errorResponse } from "@/lib/api-helpers"

/**
 * DELETE /api/payments/methods/[id]
 */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    const { data: method } = await supabase
      .from("payment_methods")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (!method) return errorResponse("Payment method not found", 404)
    if (method.user_id !== user.id) return errorResponse("Forbidden", 403)

    const { error } = await supabase.from("payment_methods").delete().eq("id", params.id)

    if (error) return errorResponse(error.message, 500)

    return successResponse({ message: "Payment method removed." })
  } catch {
    return errorResponse("Internal server error", 500)
  }
}

/**
 * PATCH /api/payments/methods/[id]
 * Set a payment method as default.
 */
export async function PATCH(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error: authError } = await getAuthUser()
    if (authError || !user) return errorResponse("Unauthorized", 401)

    const supabase = createClient()

    const { data: method } = await supabase
      .from("payment_methods")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (!method) return errorResponse("Payment method not found", 404)
    if (method.user_id !== user.id) return errorResponse("Forbidden", 403)

    // Unset all others, set this one
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id)
    const { data, error } = await supabase
      .from("payment_methods")
      .update({ is_default: true })
      .eq("id", params.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch {
    return errorResponse("Internal server error", 500)
  }
}
