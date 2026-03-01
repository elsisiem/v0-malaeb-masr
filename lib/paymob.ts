/**
 * Paymob Payment Service
 *
 * Paymob is Egypt's leading payment gateway.
 * Sign up free at: https://accept.paymob.com
 *
 * Required env vars:
 *   PAYMOB_API_KEY            — from Paymob dashboard → Settings → Account Info
 *   PAYMOB_CARD_INTEGRATION_ID — from Paymob → Accept → Payment Integrations → Card
 *   PAYMOB_WALLET_INTEGRATION_ID — Mobile Wallet integration ID
 *   PAYMOB_FAWRY_INTEGRATION_ID  — Fawry integration ID
 *   PAYMOB_IFRAME_ID           — from Paymob → Accept → iframes
 *   PAYMOB_HMAC_SECRET         — from Paymob → Settings → Security Settings → HMAC
 */

const PAYMOB_BASE_URL = "https://accept.paymob.com/api"

export interface PaymobAuthResponse {
  token: string
}

export interface PaymobOrderResponse {
  id: number
  created_at: string
  delivery_needed: boolean
  merchant: Record<string, unknown>
  collector: unknown
  amount_cents: number
  shipping_data: unknown
  currency: string
  is_payment_locked: boolean
  is_return: boolean
  is_cancel: boolean
  is_returned: boolean
  is_refunded: boolean
  is_voided: boolean
  notify_user_with_email: boolean
  items: unknown[]
  order_url: string
  commission_fees: number
  delivery_fees_cents: number
  delivery_vat_cents: number
  payment_method: string
  merchant_staff_tag: unknown
  api_source: string
  pickup_data: unknown
  delivery_status: unknown[]
}

export interface PaymobPaymentKeyResponse {
  token: string
}

export interface PaymobBillingData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  apartment: string
  floor: string
  street: string
  building: string
  city: string
  country: string
  postal_code: string
  state: string
}

/** Step 1: Get authentication token */
export async function getPaymobAuthToken(): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  })

  if (!res.ok) throw new Error("Failed to authenticate with Paymob")

  const data: PaymobAuthResponse = await res.json()
  return data.token
}

/** Step 2: Register an order */
export async function createPaymobOrder(
  authToken: string,
  amountCents: number,
  merchantOrderId: string,
): Promise<PaymobOrderResponse> {
  const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  })

  if (!res.ok) throw new Error("Failed to create Paymob order")

  return res.json()
}

/** Step 3: Get payment key */
export async function getPaymobPaymentKey(
  authToken: string,
  amountCents: number,
  orderId: number,
  integrationId: number,
  billingData: PaymobBillingData,
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: integrationId,
      lock_order_when_paid: true,
    }),
  })

  if (!res.ok) throw new Error("Failed to get Paymob payment key")

  const data: PaymobPaymentKeyResponse = await res.json()
  return data.token
}

/** Build the iframe URL for card payments */
export function getCardIframeUrl(paymentKey: string): string {
  return `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`
}

/** Verify Paymob webhook HMAC signature */
export function verifyPaymobHmac(
  transactionData: Record<string, unknown>,
  receivedHmac: string,
): boolean {
  const crypto = require("crypto")

  // Paymob concatenates these fields in this exact order
  const fields = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success",
  ]

  const concatenated = fields
    .map((field) => {
      const keys = field.split(".")
      let val: unknown = transactionData
      for (const key of keys) {
        val = (val as Record<string, unknown>)?.[key]
      }
      return String(val ?? "")
    })
    .join("")

  const computed = crypto
    .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
    .update(concatenated)
    .digest("hex")

  return computed === receivedHmac
}
