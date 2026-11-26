
import "dotenv/config";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redis.on("connect", () => {
  console.log("Redis connection established");
});

redis.on("ready", () => {
  console.log("Redis is ready to accept commands");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export default redis;
