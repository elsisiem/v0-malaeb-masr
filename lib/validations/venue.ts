import { z } from "zod"

const SPORT_TYPES = ["football", "tennis", "basketball", "volleyball", "squash", "padel", "swimming", "gym"] as const

export const createVenueSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().min(5, "Location is required"),
  district: z.string().min(2, "District is required"),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).default([]),
  sports: z.array(z.enum(SPORT_TYPES)).min(1, "At least one sport is required"),
})

export const updateVenueSchema = createVenueSchema.partial()

export const createFacilitySchema = z.object({
  name: z.string().min(3),
  type: z.enum(SPORT_TYPES),
  description: z.string().optional(),
  capacity: z.number().int().min(1).max(200),
  price: z.number().positive("Price must be positive"),
  equipmentIncluded: z.boolean().default(false),
})

export const createReviewSchema = z.object({
  bookingId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export const venueFilterSchema = z.object({
  sport: z.enum(SPORT_TYPES).optional(),
  district: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  maxDistance: z.coerce.number().optional(),
  amenities: z.string().optional(), // comma-separated
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
})

export type CreateVenueInput = z.infer<typeof createVenueSchema>
export type CreateFacilityInput = z.infer<typeof createFacilitySchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type VenueFilter = z.infer<typeof venueFilterSchema>
