
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Check database connection
pool.on("connect", () => {
  console.log("New PostgreSQL connection established");
});

// Handle unexpected database errors
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export default pool;
