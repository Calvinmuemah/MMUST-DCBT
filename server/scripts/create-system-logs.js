import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const run = async () => {
  console.log("Starting system logs migration...");
  
  try {
    // 1. Create system_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        level VARCHAR(20) DEFAULT 'info', -- info, warn, error, success
        category VARCHAR(50) DEFAULT 'system', -- auth, database, system, analytics
        message TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created system_logs table");

    // 2. Backfill from user_login_events
    await pool.query(`
      INSERT INTO system_logs (level, category, message, created_at)
      SELECT 'info', 'auth', 'User login recorded', login_at
      FROM user_login_events
    `);
    console.log("Backfilled logs from user_login_events");

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
