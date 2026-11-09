import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../src/config/db.js";
import { ensureUserPublicId } from "../src/utils/ids.js";

dotenv.config();

const [,, email, password, nameArg] = process.argv;

if (!email) {
  console.error("Usage: node scripts/create-admin.js <email> [password] [name]");
  console.error("Examples:");
  console.error("  Promote existing user : node scripts/create-admin.js admin@mmust.ac.ke");
  console.error("  Create new admin      : node scripts/create-admin.js admin@mmust.ac.ke SecurePassword123! 'Campus Admin'");
  process.exit(1);
}

async function main() {
  try {
    const existing = await pool.query(
      "SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email.trim()]
    );

    if (existing.rowCount > 0) {
      const user = existing.rows[0];
      await pool.query(
        "UPDATE users SET role = 'admin' WHERE id = $1",
        [user.id]
      );
      console.log(`[SUCCESS] User '${user.email}' (ID: ${user.id}) has been promoted to 'admin'.`);
    } else {
      if (!password) {
        console.error(`[ERROR] User '${email}' not found. To create a new user, please provide a password.`);
        process.exit(1);
      }

      const name = nameArg || "MMUST Administrator";
      const hashedPassword = await bcrypt.hash(password, 10);

      const created = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id, name, email, role`,
        [name, email.trim(), hashedPassword]
      );

      const newAdmin = created.rows[0];
      await ensureUserPublicId(newAdmin.id, newAdmin.email);

      console.log(`[SUCCESS] New admin account created successfully!`);
      console.log(`  ID   : ${newAdmin.id}`);
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Role : ${newAdmin.role}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("[ERROR] Failed to set admin role:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
