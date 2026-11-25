
import "dotenv/config";

import app from "./src/app.js";
import pool from "./src/config/db.js";
import redis from "./src/config/redis.js";
import sessionRedis from "./src/config/sessionRedis.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // 1. Connect and verify PostgreSQL
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected successfully");

        // 2. Verify existing ioredis connection (product caching)
        await redis.ping();
        console.log("Redis connected successfully");

        // 3. Connect node-redis for Express session storage
        if (!sessionRedis.isOpen) {
            await sessionRedis.connect();
        }
        console.log("Session Redis connected successfully");

        // 4. Start Express server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);

        process.exitCode = 1;

        // Clean up connections if startup fails
        await Promise.allSettled([
            pool.end(),
            sessionRedis.isOpen
                ? sessionRedis.quit()
                : Promise.resolve()
        ]);

        redis.disconnect();
    }
}

startServer();
