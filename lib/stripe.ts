/**
 * Stripe Payment Service
 *
 * Stripe is a global payment gateway that works in the US and Egypt.
 * Sign up free (test mode) at: https://stripe.com
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY                  — Dashboard → Developers → API Keys (sk_test_...)
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Dashboard → Developers → API Keys (pk_test_...)
 *   STRIPE_WEBHOOK_SECRET              — Dashboard → Developers → Webhooks → your endpoint → Signing secret
 *
 * Payment flow:
 *  1. POST /api/payments/initiate  → backend creates PaymentIntent → returns { clientSecret }
 *  2. Frontend loads Stripe Elements with clientSecret → user enters card → submits
 *  3. Stripe redirects to /api/payments/verify?payment_intent=pi_xxx&redirect_status=succeeded
 *  4. Stripe sends webhook to /api/payments/webhook with payment_intent.succeeded event
 *
 * Currency: EGP (Egyptian Pound). Stripe supports EGP.
 * In test mode, card number 4242 4242 4242 4242 always succeeds.
 */

import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Matches stripe@20.4.0 — update when you upgrade the package
  apiVersion: "2026-02-25.clover",
  typescript: true,
})

/** Currency used throughout the app */
export const STRIPE_CURRENCY = "egp" // Egyptian Pound

/**
 * Convert a price in EGP (e.g. 250.00) to the smallest currency unit (piastres).
 * Stripe requires amounts in the smallest unit.
 * EGP has 2 decimal places → multiply by 100
 */
export function toStripeAmount(egpPrice: number): number {
  return Math.round(egpPrice * 100)
}

/**
 * Verify a Stripe webhook signature to ensure the request genuinely came from Stripe.
 * Uses the raw body string (do NOT parse JSON first).
 */
export function constructStripeEvent(rawBody: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET")
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
}
