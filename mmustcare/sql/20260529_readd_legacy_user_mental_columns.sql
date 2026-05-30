-- Compatibility migration: restore legacy mental wellbeing columns on users
-- Apply this if any deployed code or trigger still expects the old schema.

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stress text,
  ADD COLUMN IF NOT EXISTS challenge text,
  ADD COLUMN IF NOT EXISTS mood text;

COMMIT;