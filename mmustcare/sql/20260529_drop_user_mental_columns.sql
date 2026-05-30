-- Migration: remove legacy mental wellbeing columns from users
-- Run this in Neon SQL Editor after verifying no code depends on these columns

BEGIN;

ALTER TABLE users
  DROP COLUMN IF EXISTS stress,
  DROP COLUMN IF EXISTS challenge,
  DROP COLUMN IF EXISTS mood;

COMMIT;
