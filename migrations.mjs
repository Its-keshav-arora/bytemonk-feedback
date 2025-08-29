import pool from "./src/lib/db.js";

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        course TEXT NOT NULL,
        howheard TEXT,
        rating INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("Migration completed ✅");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed ❌", err);
  } finally {
    client.release();
  }
}

migrate().then(() => process.exit());
