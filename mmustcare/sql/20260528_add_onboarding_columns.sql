-- Migration: add onboarding columns to users table
-- Run this on your Postgres (Neon) database

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_answers jsonb;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_total_score integer;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_risk_level text;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed
  ON users (onboarding_completed);

COMMIT;
