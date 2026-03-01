-- =============================================================================
-- Malaeb Masr - Initial Database Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROFILES (extends Supabase auth.users)
-- =============================================================================
CREATE TABLE public.profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name    TEXT,
  phone        TEXT UNIQUE,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'player'
               CHECK (role IN ('player', 'owner', 'admin')),
  sports       TEXT[] DEFAULT '{}',
  location     TEXT,
  fcm_token    TEXT,           -- Firebase Cloud Messaging token for push notifications
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- VENUES
-- =============================================================================
CREATE TABLE public.venues (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  location      TEXT NOT NULL,
  district      TEXT NOT NULL,
  lat           DECIMAL(10, 8),
  lng           DECIMAL(11, 8),
  rating        DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count  INT DEFAULT 0,
  amenities     TEXT[] DEFAULT '{}',
  images        TEXT[] DEFAULT '{}',
  sports        TEXT[] DEFAULT '{}',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- FACILITIES (belong to a venue)
-- =============================================================================
CREATE TABLE public.facilities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id            UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  name                TEXT NOT NULL,
  type                TEXT NOT NULL,   -- sport type e.g. 'football'
  description         TEXT,
  capacity            INT NOT NULL DEFAULT 10,
  price               DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image               TEXT,
  available           BOOLEAN DEFAULT TRUE,
  equipment_included  BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- AVAILABILITY SLOTS (recurring weekly schedule per facility)
-- =============================================================================
CREATE TABLE public.availability_slots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id   UUID REFERENCES public.facilities(id) ON DELETE CASCADE NOT NULL,
  day_of_week   INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE
);

-- =============================================================================
-- TEAMS
-- =============================================================================
CREATE TABLE public.teams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  sport        TEXT NOT NULL,
  description  TEXT,
  captain_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image        TEXT,
  invite_code  TEXT UNIQUE DEFAULT SUBSTRING(MD5(RANDOM()::TEXT), 1, 8),
  is_public    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TEAM MEMBERS
-- =============================================================================
CREATE TABLE public.team_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('captain', 'member')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE public.bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  venue_id            UUID REFERENCES public.venues(id) NOT NULL,
  facility_id         UUID REFERENCES public.facilities(id) NOT NULL,
  team_id             UUID REFERENCES public.teams(id),
  date                DATE NOT NULL,
  start_time          TIME NOT NULL,
  duration            INT NOT NULL DEFAULT 1,            -- hours
  player_count        INT DEFAULT 10,
  equipment_selected  JSONB DEFAULT '{}',
  price               DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'upcoming', 'past', 'canceled')),
  payment_status      TEXT NOT NULL DEFAULT 'pending'
                      CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id          TEXT,    -- Paymob order ID
  transaction_id      TEXT,    -- Paymob transaction ID
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- REVIEWS
-- =============================================================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  venue_id    UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  booking_id  UUID REFERENCES public.bookings(id),
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, venue_id)    -- one review per user per venue
);

-- Update venue rating when a review is inserted/updated/deleted
CREATE OR REPLACE FUNCTION public.update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.venues
  SET
    rating = (SELECT AVG(rating) FROM public.reviews WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_venue_rating();

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'general'
              CHECK (type IN ('booking', 'payment', 'team', 'system', 'general')),
  is_read     BOOLEAN DEFAULT FALSE,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- PAYMENT METHODS (tokenised cards saved via Paymob)
-- =============================================================================
CREATE TABLE public.payment_methods (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('card', 'wallet', 'fawry')),
  token       TEXT,           -- Paymob card token
  last_four   TEXT,
  expiry      TEXT,
  name        TEXT,
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- FAVORITES (saved venues)
-- =============================================================================
CREATE TABLE public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  venue_id    UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, venue_id)
);

-- =============================================================================
-- INDEXES for performance
-- =============================================================================
CREATE INDEX idx_venues_district         ON public.venues(district);
CREATE INDEX idx_venues_sports           ON public.venues USING GIN(sports);
CREATE INDEX idx_venues_owner            ON public.venues(owner_id);
CREATE INDEX idx_facilities_venue        ON public.facilities(venue_id);
CREATE INDEX idx_availability_facility   ON public.availability_slots(facility_id);
CREATE INDEX idx_bookings_user           ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue          ON public.bookings(venue_id);
CREATE INDEX idx_bookings_date           ON public.bookings(date);
CREATE INDEX idx_bookings_status         ON public.bookings(status);
CREATE INDEX idx_reviews_venue           ON public.reviews(venue_id);
CREATE INDEX idx_team_members_team       ON public.team_members(team_id);
CREATE INDEX idx_team_members_user       ON public.team_members(user_id);
CREATE INDEX idx_notifications_user      ON public.notifications(user_id);
CREATE INDEX idx_notifications_read      ON public.notifications(user_id, is_read);
CREATE INDEX idx_favorites_user          ON public.favorites(user_id);
CREATE INDEX idx_payment_methods_user    ON public.payment_methods(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites         ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- VENUES (public read, owner write)
CREATE POLICY "Venues are publicly viewable"
  ON public.venues FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Owners can insert venues"
  ON public.venues FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their venues"
  ON public.venues FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their venues"
  ON public.venues FOR DELETE USING (auth.uid() = owner_id);

-- FACILITIES (public read, owner write)
CREATE POLICY "Facilities are publicly viewable"
  ON public.facilities FOR SELECT USING (TRUE);
CREATE POLICY "Owners can manage facilities"
  ON public.facilities FOR ALL USING (
    auth.uid() = (SELECT owner_id FROM public.venues WHERE id = venue_id)
  );

-- AVAILABILITY SLOTS (public read, owner write)
CREATE POLICY "Slots are publicly viewable"
  ON public.availability_slots FOR SELECT USING (TRUE);
CREATE POLICY "Owners can manage availability slots"
  ON public.availability_slots FOR ALL USING (
    auth.uid() = (
      SELECT v.owner_id FROM public.venues v
      JOIN public.facilities f ON f.venue_id = v.id
      WHERE f.id = facility_id
    )
  );

-- BOOKINGS (users see own, owners see their venue bookings)
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() = (SELECT owner_id FROM public.venues WHERE id = venue_id)
  );
CREATE POLICY "Authenticated users can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and owners can update bookings"
  ON public.bookings FOR UPDATE USING (
    auth.uid() = user_id OR
    auth.uid() = (SELECT owner_id FROM public.venues WHERE id = venue_id)
  );

-- REVIEWS (public read, user can insert/update own)
CREATE POLICY "Reviews are publicly viewable"
  ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- TEAMS (public teams are visible to all, private only to members)
CREATE POLICY "Public teams are viewable"
  ON public.teams FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = captain_id OR
    auth.uid() IN (SELECT user_id FROM public.team_members WHERE team_id = id)
  );
CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);
CREATE POLICY "Captains can update their teams"
  ON public.teams FOR UPDATE USING (auth.uid() = captain_id);
CREATE POLICY "Captains can delete their teams"
  ON public.teams FOR DELETE USING (auth.uid() = captain_id);

-- TEAM MEMBERS
CREATE POLICY "Team members are viewable"
  ON public.team_members FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.team_members tm WHERE tm.team_id = team_id)
    OR auth.uid() = (SELECT captain_id FROM public.teams t WHERE t.id = team_id)
  );
CREATE POLICY "Users can join teams"
  ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Captains can manage members"
  ON public.team_members FOR DELETE USING (
    auth.uid() = user_id OR
    auth.uid() = (SELECT captain_id FROM public.teams WHERE id = team_id)
  );

-- NOTIFICATIONS (users see own only)
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- PAYMENT METHODS (users see own only)
CREATE POLICY "Users can view own payment methods"
  ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own payment methods"
  ON public.payment_methods FOR ALL USING (auth.uid() = user_id);

-- FAVORITES
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites"
  ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- SEED DATA (optional – remove before production)
-- =============================================================================
-- You can seed venues/facilities through the Supabase dashboard or via the
-- owner portal in the app once an owner account is created.
