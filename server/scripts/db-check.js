import { pool } from "../src/config/db.js";

const check = async () => {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'system_logs'
    `);
    console.log("Columns:", res.rows);
    
    const logs = await pool.query("SELECT COUNT(*) FROM system_logs");
    console.log("Log count:", logs.rows[0].count);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
