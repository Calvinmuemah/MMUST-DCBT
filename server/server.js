import app from "./app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Helper to extract database password from env or connection string
const extractDbPassword = () => {
  if (process.env.POSTGRES_PASSWORD && process.env.POSTGRES_PASSWORD.trim() !== "") {
    return process.env.POSTGRES_PASSWORD.trim();
  }
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      return decodeURIComponent(parsed.password || "");
    } catch (_) {
      // In case DATABASE_URL is not a standard URL structure
      return "";
    }
  }
  return "";
};

// Validate critical secrets and password strength at startup
const validateEnv = () => {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === "");

  if (missing.length > 0) {
    console.error(`[CRITICAL] Server startup halted. Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Production-only security constraints
  if (isProduction) {
    // 1. Enforce minimum 32 characters for JWT secret
    if (process.env.JWT_SECRET.length < 32) {
      console.error("[CRITICAL] Server startup halted. JWT_SECRET must be at least 32 characters long in production.");
      process.exit(1);
    }
    if (process.env.JWT_SECRET.includes("<GENERATE_") || process.env.JWT_SECRET.includes("your_jwt_secret")) {
      console.error("[CRITICAL] Server startup halted. JWT_SECRET contains an unreplaced placeholder.");
      process.exit(1);
    }

    // 2. Enforce database password strength
    const dbPassword = extractDbPassword();
    const weakPasswords = ["postgres", "password", "admin", "secret", "123456", "12345678", "mmust_dcbt", "root"];
    if (dbPassword.length > 0) {
      if (dbPassword.length < 16) {
        console.error(
          `[CRITICAL] Server startup halted. Database password is too short (${dbPassword.length} chars). Production database passwords must be at least 16 characters.`
        );
        process.exit(1);
      }
      if (weakPasswords.includes(dbPassword.toLowerCase()) || dbPassword.includes("<GENERATE_")) {
        console.error(
          "[CRITICAL] Server startup halted. Database password appears weak or contains an unreplaced placeholder. Generate a strong password with: openssl rand -hex 32"
        );
        process.exit(1);
      }
    }

    // 3. Enforce strict TLS certificate verification
    if (process.env.DB_SSL_ALLOW_SELFSIGNED === "true" || process.env.DB_SSL_REJECT_UNAUTHORIZED === "false") {
      console.error(
        "[CRITICAL] Server startup halted. Disabling database TLS certificate verification (DB_SSL_ALLOW_SELFSIGNED or DB_SSL_REJECT_UNAUTHORIZED=false) is prohibited in production."
      );
      process.exit(1);
    }
  }
};

const startServer = async () => {
  validateEnv();

  // Enforce fatal database connection check at startup
  try {
    await connectDB();
  } catch (err) {
    console.error("[CRITICAL] Server startup halted. Unable to establish database connectivity.");
    process.exit(1);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`[INFO] MMUST DCBT Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    });
  }
};

startServer();

export default app;
