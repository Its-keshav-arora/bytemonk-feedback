import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/mydb",
});

export default pool;
