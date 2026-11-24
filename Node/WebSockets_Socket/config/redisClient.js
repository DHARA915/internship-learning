
import Redis from "ioredis";
import { redisConnection } from "../queues/redis.connection.js";

// Main Redis connection
export const redisClient = new Redis({
    ...redisConnection,
    maxRetriesPerRequest: null
});

// Publisher connection for Socket.IO
export const pubClient = redisClient.duplicate();

// Subscriber connection for Socket.IO
export const subClient = redisClient.duplicate();

// Handle Redis connection errors
redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
});

pubClient.on("error", (error) => {
    console.error("Redis publisher error:", error);
});

subClient.on("error", (error) => {
    console.error("Redis subscriber error:", error);
});
