
import redis from "../config/redis.js";

const WINDOW_SECONDS = 15 * 60;
const MAX_REQUESTS = 100; //For testing pupose make it 5 request per ip within 15 minutes

const rateLimiter = async (req, res, next) => {
    try {
        // Get client's IP address
        const ip = req.ip;

        // Create a unique Redis key for this IP
        const key = `rate-limit:${ip}`;

        // Increase request count
        const currentCount = await redis.incr(key);

        // Set expiration only for the first request
        if (currentCount === 1) {
            await redis.expire(key, WINDOW_SECONDS);
        }

        // Calculate remaining requests
        const remaining = Math.max(
            0,
            MAX_REQUESTS - currentCount
        );

        // Get remaining expiration time
        const ttl = await redis.ttl(key);

        // Send rate limit headers
        res.setHeader("RateLimit-Limit", MAX_REQUESTS);
        res.setHeader("RateLimit-Remaining", remaining);
        res.setHeader("RateLimit-Reset", Math.max(0, ttl));

        // Check whether the limit has been exceeded
        if (currentCount > MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
                limit: MAX_REQUESTS,
                window: "15 minutes",
                retryAfter: Math.max(0, ttl)
            });
        }

        // Allow request to continue
        next();

    } catch (error) {
        console.error("Rate limiter error:", error.message);

        // Fail open if Redis is unavailable
        next();
    }
};

export default rateLimiter;
