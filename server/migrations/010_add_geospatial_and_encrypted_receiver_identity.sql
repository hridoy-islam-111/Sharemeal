-- Enable PostGIS so food posts can be searched by distance on Supabase/PostgreSQL.
CREATE EXTENSION IF NOT EXISTS postgis;

-- Keep receiver identity encrypted at rest while preserving existing user columns for other roles.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS encrypted_name TEXT,
  ADD COLUMN IF NOT EXISTS encrypted_nid TEXT;

-- Index the exact geography expression used by the nearby-food query.
CREATE INDEX IF NOT EXISTS food_posts_location_gist_idx
  ON food_posts
  USING GIST (
    (ST_SetSRID(
      ST_MakePoint(longitude::double precision, latitude::double precision),
      4326
    )::geography)
  )
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;