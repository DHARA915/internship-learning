
import crypto from "crypto";
import apiKeyRepository from "../repositories/apiKey.repository.js";

const generateApiKey = async (userId) => {

    // 1. Generate a random API key
    const apiKey = crypto.randomBytes(32).toString("hex");

    // 2. Generate SHA-256 hash
    const keyHash = crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

    // 3. Store only the hash in PostgreSQL
    const savedKey = await apiKeyRepository.createApiKey({
        userId,
        keyHash
    });

    // 4. Return original key only once
    return {
        id: savedKey.id,
        userId: savedKey.user_id,
        apiKey,
        createdAt: savedKey.created_at
    };
};

export default {
    generateApiKey
};
