import pool from "../config/db.js";

class UserRepository {

    async findAllUsers() {
        const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        ORDER BY id
    `;

        const result = await pool.query(query);
        return result.rows;
    }

    async findById(userId) {
        const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1
    `;

        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    async updateUser(userId, { name, email }) {
        const query = `
        UPDATE users
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, name, email, role, created_at, updated_at
    `;

        const result = await pool.query(query, [
            name ?? null,
            email ?? null,
            userId
        ]);

        return result.rows[0];
    }

    async findByEmail(email) {

        const query = `
            SELECT
                id,
                name,
                email,
                password_hash,
                role,
                created_at,
                updated_at
            FROM users
            WHERE email = $1
            LIMIT 1
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0] || null;

    }

    async createUser({ name, email, passwordHash }) {

        const query = `
            INSERT INTO users (
                name,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                email,
                role,
                created_at,
                updated_at
        `;

        const result = await pool.query(query, [
            name,
            email,
            passwordHash,
            "user"
        ]);

        return result.rows[0];

    }

    async createRefreshToken({ userId, tokenHash, expiresAt, family_id }) {

        const query = `
            INSERT INTO refresh_tokens (
                user_id,
                token_hash,
                expires_at,
                family_id
            )
            VALUES ($1, $2, $3 , $4)
            RETURNING
                id,
                user_id,
                family_id,
                expires_at,
                is_revoked
        `;

        const result = await pool.query(query, [
            userId,
            tokenHash,
            expiresAt,
            family_id
        ]);

        return result.rows[0];

    }

    // Rotate refresh token
    async rotateRefreshToken({
        tokenHash,
        newTokenHash,
        newExpiresAt
    }) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            // Find token family
            const familyResult = await client.query(
                `
            SELECT family_id
            FROM refresh_tokens
            WHERE token_hash = $1
            `,
                [tokenHash]
            );

            if (familyResult.rowCount === 0) {

                await client.query("ROLLBACK");

                return { status: "invalid" };

            }

            const familyId = familyResult.rows[0].family_id;

            // Lock this token family
            await client.query(
                `SELECT pg_advisory_xact_lock(hashtext($1)::bigint)`,
                [familyId]
            );

            // Fetch token after acquiring lock
            const tokenResult = await client.query(
                `
            SELECT
                rt.id,
                rt.user_id,
                rt.family_id,
                rt.expires_at,
                rt.is_revoked,
                u.role
            FROM refresh_tokens rt
            JOIN users u ON u.id = rt.user_id
            WHERE rt.token_hash = $1
            FOR UPDATE OF rt
            `,
                [tokenHash]
            );

            console.log("Token Result:", tokenResult)

            if (tokenResult.rowCount === 0) {

                await client.query("ROLLBACK");

                return { status: "invalid" };

            }

            const oldToken = tokenResult.rows[0];

            // Detect reuse
            if (oldToken.is_revoked) {

                await client.query(
                    `
                UPDATE refresh_tokens
                SET
                    is_revoked = TRUE,
                    revoked_at = COALESCE(revoked_at, NOW())
                WHERE family_id = $1
                `,
                    [familyId]
                );

                await client.query("COMMIT");

                return { status: "reuse_detected" };

            }

            // Check expiry
            if (new Date(oldToken.expires_at) <= new Date()) {

                await client.query(
                    `
                UPDATE refresh_tokens
                SET is_revoked = TRUE,
                    revoked_at = NOW()
                WHERE id = $1
                `,
                    [oldToken.id]
                );

                await client.query("COMMIT");

                return { status: "expired" };

            }

            // Create replacement token
            const newTokenResult = await client.query(
                `
            INSERT INTO refresh_tokens (
                user_id,
                token_hash,
                expires_at,
                family_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
                [
                    oldToken.user_id,
                    newTokenHash,
                    newExpiresAt,
                    familyId
                ]
            );

            const newTokenId = newTokenResult.rows[0].id;

            // Revoke old token and link replacement
            await client.query(
                `
            UPDATE refresh_tokens
            SET
                is_revoked = TRUE,
                revoked_at = NOW(),
                replaced_by_token_id = $1
            WHERE id = $2
            `,
                [newTokenId, oldToken.id]
            );

            await client.query("COMMIT");

            return {
                status: "rotated",
                userId: oldToken.user_id,
                role: oldToken.role
            };

        } catch (error) {

            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();

        }

    }

    // Revoke Resfresh Token

async revokeRefreshToken(tokenHash) {

    const query = `
        UPDATE refresh_tokens
        SET
            is_revoked = TRUE,
            revoked_at = COALESCE(revoked_at, NOW())
        WHERE token_hash = $1
          AND is_revoked = FALSE
        RETURNING id
    `;

    const result = await pool.query(query, [tokenHash]);

    return result.rowCount > 0;
}


}

export default new UserRepository();