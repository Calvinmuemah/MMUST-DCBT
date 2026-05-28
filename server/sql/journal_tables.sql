CREATE TABLE IF NOT EXISTS journal_entries (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood VARCHAR(50) NOT NULL,
  insight TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT journal_entries_content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id_created_at
  ON journal_entries (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_public_id
  ON journal_entries (public_id);

CREATE OR REPLACE FUNCTION update_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_journal_entries_updated_at ON journal_entries;

CREATE TRIGGER trg_update_journal_entries_updated_at
BEFORE UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_journal_entries_updated_at();