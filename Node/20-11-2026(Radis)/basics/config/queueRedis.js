import Redis from "ioredis";
import "dotenv/config";

const queueRedis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,

    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,

    // Required by BullMQ workers
    maxRetriesPerRequest: null
});

queueRedis.on("connect", () => {
    console.log("BullMQ Redis connected");
});

queueRedis.on("error", (error) => {
    console.error("BullMQ Redis error:", error.message);
});

export default queueRedis;