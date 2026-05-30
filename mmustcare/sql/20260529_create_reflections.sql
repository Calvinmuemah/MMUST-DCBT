-- Migration: create reflections table
-- Stores user's reflection entries (thinking patterns, notes, mood)

BEGIN;

CREATE TABLE IF NOT EXISTS reflections (
  id BIGSERIAL PRIMARY KEY,
  public_id TEXT UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_rating INT,
  text TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reflections_user_created_at
  ON reflections (user_id, created_at DESC);

COMMIT;
