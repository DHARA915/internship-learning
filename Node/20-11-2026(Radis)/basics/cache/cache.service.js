import redis from "../config/redis.js";

const cacheService = {

    // Get data from Redis
    async get(key) {

        const data = await redis.get(key);


        if (data === null) {
            return null;
        }

        try {
            return JSON.parse(data);

        } catch (error) {

            console.error("Invalid cached JSON:", error.message);

            await redis.del(key);

            return null;
        }
    },

    // Store data in Redis with TTL
    async set(key, value, ttl = 300) {

        const result = await redis.set(
            key,
            JSON.stringify(value),
            "EX",
            ttl
        );

        console.log("Redis SET:", key, result);

        // Verify immediately after storing
        const savedData = await redis.get(key);

        return result;
    },

    // Delete data from Redis
    async delete(key) {

        return await redis.del(key);
    },

    // Delete all keys matching a pattern
    async deletePattern(pattern) {
        let cursor = "0";
        let deletedCount = 0;

        do {
            const [nextCursor, keys] = await redis.scan(
                cursor,
                "MATCH",
                pattern,
                "COUNT",
                100
            );

            cursor = nextCursor;

            if (keys.length > 0) {
                deletedCount += await redis.del(...keys);
            }

        } while (cursor !== "0");

        return deletedCount;
    }

};

export default cacheService;