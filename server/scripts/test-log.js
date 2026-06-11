import { pool } from "../src/config/db.js";

const test = async () => {
  try {
    console.log("Inserting test log...");
    await pool.query(
      `INSERT INTO system_logs (level, category, message, metadata) VALUES ($1, $2, $3, $4)`,
      ['info', 'system', 'Test log from script', JSON.stringify({ script: true })]
    );
    console.log("Insertion successful.");
    
    const res = await pool.query("SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 1");
    console.log("Latest log:", res.rows[0]);
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

test();
