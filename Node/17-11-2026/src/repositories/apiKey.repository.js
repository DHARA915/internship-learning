
import pool from "../config/db.js";

const createApiKey = async ({ userId, keyHash }) => {

    const query = `
        INSERT INTO api_keys (
            user_id,
            key_hash
        )
        VALUES ($1, $2)
        RETURNING id, user_id, created_at
    `;

    const result = await pool.query(query, [
        userId,
        keyHash
    ]);

    return result.rows[0];
};

export default {
    createApiKey
};
