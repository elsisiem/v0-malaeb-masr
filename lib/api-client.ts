/**
 * lib/api-client.ts
 *
 * Typed frontend client for all Malaeb Masr API routes.
 * Drop-in replacement for the mock-data functions — swap imports as you go.
 *
 * Usage:
 *   import { api } from "@/lib/api-client"
 *   const { data } = await api.venues.list({ sport: "football" })
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages?: number
  }
}

// Re-export shared domain types for convenience
export type { Database } from "@/lib/types/database"

// ─── Base fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string | number | boolean | undefined> },
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options ?? {}

  let url = path
  if (params) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v))
    })
    const qsStr = qs.toString()
    if (qsStr) url += `?${qsStr}`
  }

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...fetchOptions.headers },
    credentials: "include", // send cookies for Supabase session
    ...fetchOptions,
  })

  const json = await res.json()
  return json as ApiResponse<T>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: { email: string; password: string; fullName: string; phone?: string; role?: "player" | "owner" }) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  logout: () => apiFetch("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch("/api/auth/me"),
}

// ─── Venues ───────────────────────────────────────────────────────────────────

export const venuesApi = {
  list: (params?: {
    sport?: string
    district?: string
    minPrice?: number
    maxPrice?: number
    amenities?: string
    search?: string
    page?: number
    pageSize?: number
  }) => apiFetch("/api/venues", { params }),

  get: (id: string) => apiFetch(`/api/venues/${id}`),

  create: (body: {
    name: string
    description?: string
    location: string
    district: string
    lat?: number
    lng?: number
    amenities?: string[]
    sports: string[]
  }) => apiFetch("/api/venues", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: Partial<{
      name: string
      description: string
      location: string
      district: string
      lat: number
      lng: number
      amenities: string[]
      sports: string[]
    }>,
  ) => apiFetch(`/api/venues/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: string) => apiFetch(`/api/venues/${id}`, { method: "DELETE" }),

  // Facilities
  getFacilities: (venueId: string) => apiFetch(`/api/venues/${venueId}/facilities`),

  addFacility: (
    venueId: string,
    body: { name: string; type: string; description?: string; capacity: number; price: number; equipmentIncluded?: boolean },
  ) => apiFetch(`/api/venues/${venueId}/facilities`, { method: "POST", body: JSON.stringify(body) }),

  // Availability
  getAvailability: (venueId: string, facilityId: string, date: string) =>
    apiFetch(`/api/venues/${venueId}/availability`, { params: { facilityId, date } }),

  // Reviews
  getReviews: (venueId: string, page = 1, pageSize = 10) =>
    apiFetch(`/api/venues/${venueId}/reviews`, { params: { page, pageSize } }),

  addReview: (venueId: string, body: { rating: number; comment?: string; bookingId?: string }) =>
    apiFetch(`/api/venues/${venueId}/reviews`, { method: "POST", body: JSON.stringify(body) }),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  list: (params?: { status?: string; page?: number; pageSize?: number }) =>
    apiFetch("/api/bookings", { params }),

  get: (id: string) => apiFetch(`/api/bookings/${id}`),

  create: (body: {
    venueId: string
    facilityId: string
    date: string
    startTime: string
    duration: number
    playerCount: number
    equipmentSelected?: Record<string, boolean>
    notes?: string
    teamId?: string
    paymentMethod?: string
  }) => apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(body) }),

  cancel: (id: string, reason?: string) =>
    apiFetch(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ reason }) }),

  getQrUrl: (id: string) => `/api/bookings/${id}/qr`,
}

// ─── Payments ────────────────────────────────────────────────────────────────

export const paymentsApi = {
  initiate: (body: { bookingId: string; paymentMethod?: "card" | "wallet" | "fawry" }) =>
    apiFetch("/api/payments/initiate", { method: "POST", body: JSON.stringify(body) }),

  getMethods: () => apiFetch("/api/payments/methods"),

  addMethod: (body: {
    type: "card" | "wallet" | "fawry"
    token?: string
    lastFour?: string
    expiry?: string
    name?: string
    isDefault?: boolean
  }) => apiFetch("/api/payments/methods", { method: "POST", body: JSON.stringify(body) }),

  removeMethod: (id: string) => apiFetch(`/api/payments/methods/${id}`, { method: "DELETE" }),

  setDefaultMethod: (id: string) => apiFetch(`/api/payments/methods/${id}`, { method: "PATCH" }),
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export const teamsApi = {
  list: (params?: { tab?: "myTeams" | "discover"; search?: string; page?: number; pageSize?: number }) =>
    apiFetch("/api/teams", { params }),

  get: (id: string) => apiFetch(`/api/teams/${id}`),

  create: (body: { name: string; sport: string; description?: string; isPublic?: boolean }) =>
    apiFetch("/api/teams", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: Partial<{ name: string; sport: string; description: string; isPublic: boolean }>,
  ) => apiFetch(`/api/teams/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: string) => apiFetch(`/api/teams/${id}`, { method: "DELETE" }),

  getMembers: (id: string) => apiFetch(`/api/teams/${id}/members`),

  removeMember: (teamId: string, userId: string) =>
    apiFetch(`/api/teams/${teamId}/members`, { method: "DELETE", body: JSON.stringify({ userId }) }),

  join: (teamId: string, inviteCode?: string) =>
    apiFetch(`/api/teams/${teamId}/join`, { method: "POST", body: JSON.stringify({ inviteCode }) }),
}

// ─── User ─────────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => apiFetch("/api/users/me"),

  updateProfile: (body: { fullName?: string; phone?: string; location?: string; sports?: string[]; fcmToken?: string }) =>
    apiFetch("/api/users/me", { method: "PUT", body: JSON.stringify(body) }),

  uploadAvatar: (file: File) => {
    const fd = new FormData()
    fd.append("avatar", file)
    return fetch("/api/users/me", {
      method: "POST",
      credentials: "include",
      body: fd,
    }).then((r) => r.json())
  },

  getFavorites: () => apiFetch("/api/users/me/favorites"),

  addFavorite: (venueId: string) =>
    apiFetch("/api/users/me/favorites", { method: "POST", body: JSON.stringify({ venueId }) }),

  removeFavorite: (venueId: string) =>
    apiFetch("/api/users/me/favorites", { method: "DELETE", params: { venueId } }),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean; page?: number; pageSize?: number }) =>
    apiFetch("/api/notifications", { params }),

  markAsRead: (id: string) => apiFetch(`/api/notifications/${id}/read`, { method: "PUT" }),

  markAllAsRead: () => apiFetch("/api/notifications/read-all", { method: "PUT" }),
}

// ─── Owner ────────────────────────────────────────────────────────────────────

export const ownerApi = {
  getAnalytics: () => apiFetch("/api/owner/analytics"),

  getBookings: (params?: { status?: string; venueId?: string; date?: string; page?: number; pageSize?: number }) =>
    apiFetch("/api/owner/bookings", { params }),

  getVenues: () => apiFetch("/api/owner/venues"),
}

// ─── Convenience default export ───────────────────────────────────────────────

export const api = {
  auth: authApi,
  venues: venuesApi,
  bookings: bookingsApi,
  payments: paymentsApi,
  teams: teamsApi,
  user: userApi,
  notifications: notificationsApi,
  owner: ownerApi,
}
