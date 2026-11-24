import { randomUUID } from "node:crypto";
import { redisClient } from "../config/redisClient.js";

const PROCESSING_TTL = 60;
const PROCESSED_TTL = 24 * 60 * 60;

// Acquire a lock for a webhook event
export async function acquireWebhookLock(idempotencyKey) {
    const redisKey = `webhook:payment:${idempotencyKey}`;

    // Unique identifier for this particular request
    const lockToken = randomUUID();

    const result = await redisClient.set(
        redisKey,
        `processing:${lockToken}`,
        "EX",
        PROCESSING_TTL,
        "NX"
    );

    // Lock successfully acquired
    if (result === "OK") {
        return {
            status: "acquired",
            redisKey,
            lockToken
        };
    }

    // Another request already owns or completed this event
    const existingValue = await redisClient.get(redisKey);

    if (existingValue === "processed") {
        return {
            status: "duplicate"
        };
    }

    return {
        status: "processing"
    };
}

// Mark the event as successfully processed
export async function markWebhookProcessed(redisKey, lockToken) {
    const script = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("SET", KEYS[1], "processed", "EX", ARGV[2])
        end

        return 0
    `;

    const result = await redisClient.eval(
        script,
        1,
        redisKey,
        `processing:${lockToken}`,
        PROCESSED_TTL
    );

    return result === "OK";
}

// Release the lock if processing fails
export async function releaseWebhookLock(redisKey, lockToken) {
    const script = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
        end

        return 0
    `;

    return redisClient.eval(
        script,
        1,
        redisKey,
        `processing:${lockToken}`
    );
}