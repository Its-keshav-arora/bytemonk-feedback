import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://bytemonk:bytemonk@bytemonk-7btl3-postgresql.bytemonk-7btl3.svc.cluster.local:5432/bytemonk",
});

export default pool;
