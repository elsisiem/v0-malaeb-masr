import { z } from "zod"

export const createBookingSchema = z.object({
  venueId: z.string().uuid("Invalid venue ID"),
  facilityId: z.string().uuid("Invalid facility ID"),
  teamId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  duration: z.number().int().min(1).max(8, "Max duration is 8 hours"),
  playerCount: z.number().int().min(1).max(200),
  equipmentSelected: z.record(z.boolean()).default({}),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["card", "wallet", "cash", "fawry"]).default("card"),
  savePaymentMethod: z.boolean().default(false),
})

export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
