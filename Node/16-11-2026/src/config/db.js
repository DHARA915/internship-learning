
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

    // Connection Pool Configuration
    min: 2,
    max: 10,

    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Handle unexpected pool errors
pool.on("error", (error) => {
    console.error("Unexpected database error:", error.message);
});

export default pool;
