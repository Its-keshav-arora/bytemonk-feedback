import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.PG_ADMIN_URL,
});

export default pool;
