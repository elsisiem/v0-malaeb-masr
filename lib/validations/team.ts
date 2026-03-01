import { z } from "zod"

const SPORT_TYPES = ["football", "tennis", "basketball", "volleyball", "squash", "padel", "swimming", "gym"] as const

export const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(50),
  sport: z.enum(SPORT_TYPES),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
})

export const updateTeamSchema = createTeamSchema.partial()

export const joinTeamSchema = z.object({
  inviteCode: z.string().length(8, "Invite code must be 8 characters"),
})

export const inviteMemberSchema = z.object({
  userId: z.string().uuid().optional(),
  email: z.string().email().optional(),
}).refine((d) => d.userId || d.email, {
  message: "Either userId or email is required",
})

export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
export type JoinTeamInput = z.infer<typeof joinTeamSchema>
