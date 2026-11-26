
import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import redis from "./config/redis.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Check PostgreSQL connection
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");

    // Check Redis connection
    const redisResponse = await redis.ping();

    if (redisResponse !== "PONG") {
      throw new Error("Redis health check failed");
    }

    console.log("Redis connected successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    await pool.end();
    redis.disconnect();

    process.exit(1);
  }
};

startServer();
