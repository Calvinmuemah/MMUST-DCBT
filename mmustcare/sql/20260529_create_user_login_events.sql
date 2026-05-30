-- Migration: create user_login_events table
-- Stores successful login activity for attendance reporting.

BEGIN;

CREATE TABLE IF NOT EXISTS user_login_events (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_login_events_user_created_at
  ON user_login_events (user_id, created_at DESC);

COMMIT;
