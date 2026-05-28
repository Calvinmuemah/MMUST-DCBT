ALTER TABLE users
  ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS token_version integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
  ON users (LOWER(email));
