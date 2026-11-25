
import pool from "../config/database.js";
import redisClient from "../config/redis.js";

// Liveness check: is the Node.js application running?
const healthCheck = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Application is healthy",
    status: "OK"
  });
};

// Readiness check: are PostgreSQL and Redis available?
const readinessCheck = async (req, res) => {
  const checks = await Promise.allSettled([
    pool.query("SELECT 1"),
    redisClient.ping()
  ]);

  const databaseHealthy = checks[0].status === "fulfilled";
  const redisHealthy = checks[1].status === "fulfilled";

  const isReady = databaseHealthy && redisHealthy;

  if (!isReady) {
    req.log?.error(
      {
        database: databaseHealthy,
        redis: redisHealthy
      },
      "Application readiness check failed"
    );
  }

  return res.status(isReady ? 200 : 503).json({
    success: isReady,
    status: isReady ? "READY" : "NOT_READY",
    services: {
      database: databaseHealthy ? "connected" : "disconnected",
      redis: redisHealthy ? "connected" : "disconnected"
    }
  });
};

export default {
  healthCheck,
  readinessCheck
};
