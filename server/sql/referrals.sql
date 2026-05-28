ALTER TABLE users
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by_user_id UUID,
  ADD COLUMN IF NOT EXISTS referral_reward_points INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_invites_count INTEGER NOT NULL DEFAULT 0;

UPDATE users
SET referral_code = 'MMUST' || upper(substr(md5(id::text || coalesce(email, '')), 1, 8))
WHERE referral_code IS NULL OR referral_code = '';

ALTER TABLE users
  ADD CONSTRAINT users_referred_by_user_id_fkey
  FOREIGN KEY (referred_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_unique_idx
  ON users (referral_code);

CREATE INDEX IF NOT EXISTS idx_users_referred_by_user_id
  ON users (referred_by_user_id);

CREATE TABLE IF NOT EXISTS referral_redemptions (
  id BIGSERIAL PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  reward_points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT referral_redemptions_unique_referred_user UNIQUE (referred_user_id),
  CONSTRAINT referral_redemptions_self_referral_check CHECK (referrer_user_id <> referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referrer_user_id
  ON referral_redemptions (referrer_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referral_code
  ON referral_redemptions (referral_code);
