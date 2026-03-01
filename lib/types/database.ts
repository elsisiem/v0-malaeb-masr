// Supabase database types — hand-maintained (mirrors the schema in supabase/migrations/001_initial_schema.sql)
// Run `pnpm supabase gen types typescript` to regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: "player" | "owner" | "admin"
          sports: string[]
          location: string | null
          fcm_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "player" | "owner" | "admin"
          sports?: string[]
          location?: string | null
          fcm_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "player" | "owner" | "admin"
          sports?: string[]
          location?: string | null
          fcm_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }

      venues: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          location: string
          district: string
          lat: number | null
          lng: number | null
          rating: number
          review_count: number
          amenities: string[]
          images: string[]
          sports: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          location: string
          district: string
          lat?: number | null
          lng?: number | null
          rating?: number
          review_count?: number
          amenities?: string[]
          images?: string[]
          sports?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          location?: string
          district?: string
          lat?: number | null
          lng?: number | null
          amenities?: string[]
          images?: string[]
          sports?: string[]
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          id: string
          venue_id: string
          name: string
          type: string
          description: string | null
          capacity: number
          price: number
          image: string | null
          available: boolean
          equipment_included: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          name: string
          type: string
          description?: string | null
          capacity?: number
          price: number
          image?: string | null
          available?: boolean
          equipment_included?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          type?: string
          description?: string | null
          capacity?: number
          price?: number
          image?: string | null
          available?: boolean
          equipment_included?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          id: string
          facility_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: {
          id?: string
          facility_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
        }
        Update: {
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          venue_id: string
          facility_id: string
          team_id: string | null
          date: string
          start_time: string
          duration: number
          player_count: number
          equipment_selected: Json
          price: number
          status: "pending" | "confirmed" | "upcoming" | "past" | "canceled"
          payment_status: "pending" | "paid" | "refunded" | "failed"
          payment_id: string | null
          transaction_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          venue_id: string
          facility_id: string
          team_id?: string | null
          date: string
          start_time: string
          duration?: number
          player_count?: number
          equipment_selected?: Json
          price: number
          status?: "pending" | "confirmed" | "upcoming" | "past" | "canceled"
          payment_status?: "pending" | "paid" | "refunded" | "failed"
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: "pending" | "confirmed" | "upcoming" | "past" | "canceled"
          payment_status?: "pending" | "paid" | "refunded" | "failed"
          payment_id?: string | null
          transaction_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          venue_id: string
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          venue_id: string
          booking_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          comment?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          name: string
          sport: string
          description: string | null
          captain_id: string
          image: string | null
          invite_code: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sport: string
          description?: string | null
          captain_id: string
          image?: string | null
          invite_code?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          sport?: string
          description?: string | null
          image?: string | null
          is_public?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: "captain" | "member"
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: "captain" | "member"
          joined_at?: string
        }
        Update: {
          role?: "captain" | "member"
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "booking" | "payment" | "team" | "system" | "general"
          is_read: boolean
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: "booking" | "payment" | "team" | "system" | "general"
          is_read?: boolean
          data?: Json
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: "card" | "wallet" | "fawry"
          token: string | null
          last_four: string | null
          expiry: string | null
          name: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "card" | "wallet" | "fawry"
          token?: string | null
          last_four?: string | null
          expiry?: string | null
          name?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          is_default?: boolean
          name?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          venue_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          venue_id: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
