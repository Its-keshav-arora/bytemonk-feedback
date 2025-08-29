import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://bytemonk:bytemonk@asia-east1-001.proxy.kinsta.app:30354/bytemonk",
});

export default pool;
