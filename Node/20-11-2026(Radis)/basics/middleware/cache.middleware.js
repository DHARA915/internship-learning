
import redis from "../config/redis.js";

const cacheMiddleware = (ttl = 60) => {
    return async (req, res, next) => {
        try {
            // Only cache GET requests
            if (req.method !== "GET") {
                return next();
            }

            // Create a unique cache key for this URL
            const cacheKey = `cache:${req.originalUrl}`;

            // Check whether response exists in Redis
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                console.log("CACHE HIT:", cacheKey);

                res.setHeader("X-Cache", "HIT");

                return res.status(200).json(JSON.parse(cachedData));
            }

            console.log("CACHE MISS:", cacheKey);

            // Save original res.json method
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = (data) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis.set(
                        cacheKey,
                        JSON.stringify(data),
                        "EX",
                        ttl
                    ).catch((error) => {
                        console.error("Cache save error:", error.message);
                    });
                }

                return originalJson(data);
            };

            next();

        } catch (error) {
            console.error("Cache middleware error:", error.message);

            // If Redis fails, continue without caching
            next();
        }
    };
};

export default cacheMiddleware;
