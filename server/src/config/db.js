import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Configure SSL for Cloud Postgres (Neon/Supabase) or when explicitly configured
const useSSL = process.env.DATABASE_URL?.includes("sslmode=require") || process.env.DB_SSL === "true";

let sslConfig = false;
if (useSSL) {
  if (process.env.DB_SSL_CA) {
    sslConfig = {
      ca: process.env.DB_SSL_CA,
      rejectUnauthorized: true,
    };
  } else if (process.env.DB_SSL_ALLOW_SELFSIGNED === "true" || process.env.DB_SSL_REJECT_UNAUTHORIZED === "false") {
    // Strictly forbid disabling certificate verification in production
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[CRITICAL CONFIG ERROR] Insecure TLS override detected: Disabling database certificate verification (DB_SSL_ALLOW_SELFSIGNED or DB_SSL_REJECT_UNAUTHORIZED=false) is prohibited in production. Provide a trusted CA certificate (DB_SSL_CA) or use valid certificates."
      );
    }
    // Permitted only in non-production (e.g. local dev / test suites)
    sslConfig = { rejectUnauthorized: false };
  } else {
    // Production default: strictly enforce TLS certificate verification
    sslConfig = { rejectUnauthorized: true };
  }
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(sslConfig ? { ssl: sslConfig } : {}),
});

export const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("[INFO] PostgreSQL connected successfully");
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[CRITICAL] PostgreSQL connection error:", err.message);
    } else {
      // In production, sanitize logs to avoid leaking connection strings, hosts, or credentials
      console.error("[CRITICAL] [DatabaseConnectionError] Failed to connect to PostgreSQL. Check host, credentials, and network.");
    }
    throw err;
  }
};