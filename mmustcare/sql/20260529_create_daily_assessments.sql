-- Migration: create daily_assessments table
-- Run this in Neon SQL Editor

BEGIN;

CREATE TABLE IF NOT EXISTS daily_assessments (
  id BIGSERIAL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stress_level text NOT NULL,
  main_challenge text NOT NULL,
  overwhelm_frequency text NOT NULL,
  answers jsonb,
  total_score integer,
  risk_level text,
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_assessments_one_per_day UNIQUE (user_id, assessment_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_assessments_user_date
  ON daily_assessments (user_id, assessment_date DESC);

CREATE OR REPLACE FUNCTION update_daily_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_daily_assessments_updated_at ON daily_assessments;

CREATE TRIGGER trg_update_daily_assessments_updated_at
BEFORE UPDATE ON daily_assessments
FOR EACH ROW
EXECUTE FUNCTION update_daily_assessments_updated_at();

COMMIT;
