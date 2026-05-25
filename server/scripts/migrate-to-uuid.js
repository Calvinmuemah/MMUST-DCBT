import dotenv from "dotenv";
import pkg from "pg";
import { v5 as uuidv5 } from "uuid";

dotenv.config();

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const namespace = uuidv5(jwtSecret, uuidv5.DNS);
const makeUuid = (seed) => uuidv5(String(seed), namespace);
const quoteIdent = (value) => `"${String(value).replace(/"/g, '""')}"`;

const hasUuidPrimaryKey = async () => {
  const result = await pool.query(
    `SELECT data_type
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'users'
       AND column_name = 'id'`
  );

  return result.rows[0]?.data_type === "uuid";
};

const dropConstraints = async (tableName, types) => {
  const result = await pool.query(
    `SELECT con.conname AS name
     FROM pg_constraint con
     JOIN pg_class rel ON rel.oid = con.conrelid
     JOIN pg_namespace nsp ON nsp.oid = con.connamespace
     WHERE nsp.nspname = 'public'
       AND rel.relname = $1
       AND con.contype = ANY($2::text[])`,
    [tableName, types]
  );

  for (const row of result.rows) {
    await pool.query(
      `ALTER TABLE ${quoteIdent(tableName)} DROP CONSTRAINT IF EXISTS ${quoteIdent(row.name)}`
    );
  }
};

const run = async () => {
  if (await hasUuidPrimaryKey()) {
    console.log("UUID migration already applied; nothing to do.");
    return;
  }

  await pool.query("BEGIN");

  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS id_uuid uuid`);
    await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS id_uuid uuid`);
    await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS user_id_uuid uuid`);
    await pool.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS session_id_uuid uuid`);

    const users = await pool.query(
      `SELECT id, email
       FROM users
       ORDER BY id ASC`
    );

    const userIdMap = new Map();

    for (const row of users.rows) {
      const newId = makeUuid(`user:${row.email}:${row.id}`);
      userIdMap.set(String(row.id), newId);
      await pool.query(
        `UPDATE users SET id_uuid = $1 WHERE id = $2`,
        [newId, row.id]
      );
    }

    const sessions = await pool.query(
      `SELECT id, user_id, topic, created_at
       FROM chat_sessions
       ORDER BY id ASC`
    );

    const sessionIdMap = new Map();

    for (const row of sessions.rows) {
      const ownerUuid = userIdMap.get(String(row.user_id));
      const seed = `session:${row.id}:${row.user_id}:${row.topic}:${row.created_at ?? ""}`;
      const newId = makeUuid(seed);
      sessionIdMap.set(String(row.id), newId);

      await pool.query(
        `UPDATE chat_sessions
         SET id_uuid = $1,
             user_id_uuid = $2
         WHERE id = $3`,
        [newId, ownerUuid, row.id]
      );
    }

    const messages = await pool.query(
      `SELECT id, session_id
       FROM chat_messages
       ORDER BY id ASC`
    );

    for (const row of messages.rows) {
      const newSessionId = sessionIdMap.get(String(row.session_id));
      await pool.query(
        `UPDATE chat_messages
         SET session_id_uuid = $1
         WHERE id = $2`,
        [newSessionId, row.id]
      );
    }

    const missingUsers = await pool.query(`SELECT COUNT(*)::int AS count FROM users WHERE id_uuid IS NULL`);
    const missingSessions = await pool.query(`SELECT COUNT(*)::int AS count FROM chat_sessions WHERE id_uuid IS NULL OR user_id_uuid IS NULL`);
    const missingMessages = await pool.query(`SELECT COUNT(*)::int AS count FROM chat_messages WHERE session_id_uuid IS NULL`);

    if (missingUsers.rows[0].count || missingSessions.rows[0].count || missingMessages.rows[0].count) {
      throw new Error("UUID backfill failed; aborting migration");
    }

    await dropConstraints("chat_messages", ["f"]);
    await dropConstraints("chat_sessions", ["f", "p"]);
    await dropConstraints("users", ["p"]);

    await pool.query(`ALTER TABLE chat_messages DROP COLUMN session_id`);
    await pool.query(`ALTER TABLE chat_messages RENAME COLUMN session_id_uuid TO session_id`);
    await pool.query(`ALTER TABLE chat_messages ALTER COLUMN session_id SET NOT NULL`);

    await pool.query(`ALTER TABLE chat_sessions DROP COLUMN user_id`);
    await pool.query(`ALTER TABLE chat_sessions DROP COLUMN id`);
    await pool.query(`ALTER TABLE chat_sessions RENAME COLUMN id_uuid TO id`);
    await pool.query(`ALTER TABLE chat_sessions RENAME COLUMN user_id_uuid TO user_id`);
    await pool.query(`ALTER TABLE chat_sessions ALTER COLUMN id SET NOT NULL`);
    await pool.query(`ALTER TABLE chat_sessions ALTER COLUMN user_id SET NOT NULL`);

    await pool.query(`ALTER TABLE users DROP COLUMN id`);
    await pool.query(`ALTER TABLE users RENAME COLUMN id_uuid TO id`);
    await pool.query(`ALTER TABLE users ALTER COLUMN id SET NOT NULL`);

    await pool.query(`ALTER TABLE users ADD PRIMARY KEY (id)`);
    await pool.query(`ALTER TABLE chat_sessions ADD PRIMARY KEY (id)`);
    await pool.query(
      `ALTER TABLE chat_sessions
       ADD CONSTRAINT chat_sessions_user_id_fkey
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
    );
    await pool.query(
      `ALTER TABLE chat_messages
       ADD CONSTRAINT chat_messages_session_id_fkey
       FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE`
    );

    await pool.query(`ALTER TABLE chat_messages DROP COLUMN session_id_uuid`);
    await pool.query(`ALTER TABLE chat_sessions DROP COLUMN id_uuid`);
    await pool.query(`ALTER TABLE chat_sessions DROP COLUMN user_id_uuid`);
    await pool.query(`ALTER TABLE users DROP COLUMN id_uuid`);

    await pool.query("COMMIT");
    console.log("UUID migration completed successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    await pool.end();
  }
};

run().catch(async (error) => {
  console.error("UUID migration failed:", error.message);
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});
