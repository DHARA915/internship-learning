import redis from "../config/redis.js";

const DEFAULT_TTL = 300;

// Get data from Redis
export const getCache = async (key) => {
  try {
    const cachedData = await redis.get(key);

    if (!cachedData) {
      return null;
    }

    return JSON.parse(cachedData);
  } catch (error) {
    console.error("Redis cache read failed:", error.message);
    return null;
  }
};

// Store data in Redis
export const setCache = async (
  key,
  data,
  ttl = DEFAULT_TTL
) => {
  try {
    await redis.set(
      key,
      JSON.stringify(data),
      "EX",
      ttl
    );
  } catch (error) {
    console.error("Redis cache write failed:", error.message);
  }
};

// Delete data from Redis
export const deleteCache = async (...keys) => {
  try {
    if (keys.length === 0) return;

    await redis.del(...keys);
  } catch (error) {
    console.error("Redis cache deletion failed:", error.message);
  }
};

// Delete multiple cache entries matching a pattern
export const deleteCachePattern = async (pattern) => {
  try {
    let cursor = "0";

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
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis pattern cache deletion failed:", error.message);
  }
};