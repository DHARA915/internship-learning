import { createClient } from "redis";
import "dotenv/config";

const sessionRedis = createClient({
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,

    socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379
    }
});

sessionRedis.on("error", (error) => {
    console.error("Session Redis error:", error.message);
});

sessionRedis.on("ready", () => {
    console.log("Session Redis is ready");
});

export default sessionRedis;