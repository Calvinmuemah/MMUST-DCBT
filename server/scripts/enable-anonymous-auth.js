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
  console.log("Starting anonymous auth migration...");
  
  try {
    // 1. Add is_anonymous column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE
    `);
    console.log("Added is_anonymous column");

    // 2. Make email and password nullable
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN email DROP NOT NULL,
      ALTER COLUMN password DROP NOT NULL
    `);
    console.log("Made email and password nullable");

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
