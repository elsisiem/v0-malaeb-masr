-- =============================================================================
-- Malaeb Masr - Venues table patch
-- Run this in your Supabase SQL editor after 001_initial_schema.sql
-- =============================================================================

-- Make district optional (it was NOT NULL with no default, blocking inserts)
ALTER TABLE public.venues
  ALTER COLUMN district DROP NOT NULL,
  ALTER COLUMN district SET DEFAULT '';

-- Add price column (default hourly rate for the venue)
ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0);

-- Add address column (human-readable street address, optional)
ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Add available alias that mirrors is_active (some API code uses 'available')
-- We'll just use is_active everywhere and alias in queries
-- No new column needed — the API will be fixed to use is_active.
