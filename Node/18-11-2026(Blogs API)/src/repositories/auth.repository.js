
import pool from "../config/database.js";

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT
            id,
            name,
            email,
            password_hash,
            role,
            is_active,
            created_at,
            updated_at
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [email]
    );

    return result.rows[0] || null;
};

const createUser = async ({ name, email, passwordHash }) => {
    const result = await pool.query(
        `INSERT INTO users
            (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING
            id,
            name,
            email,
            role,
            is_active,
            created_at`,
        [
            name,
            email,
            passwordHash,
            "reader"
        ]
    );

    return result.rows[0];
};

// Store hashed refresh token
const createRefreshToken = async ({
    userId,
    tokenHash,
    familyId,
    expiresAt
}) => {
    const result = await pool.query(
        `INSERT INTO refresh_tokens
            (user_id, token_hash, family_id, expires_at)
         VALUES ($1, $2, $3, $4)
         RETURNING
            id,
            user_id,
            family_id,
            expires_at,
            is_revoked,
            created_at`,
        [userId, tokenHash, familyId, expiresAt]
    );

    return result.rows[0];
};

// revoke token
const revokeRefreshToken = async (tokenHash) => {
    const result = await pool.query(
        `UPDATE refresh_tokens
     SET is_revoked = TRUE,
         revoked_at = CURRENT_TIMESTAMP
     WHERE token_hash = $1
       AND is_revoked = FALSE
     RETURNING id`,
        [tokenHash]
    );

    return result.rowCount > 0;
};


const rotateRefreshToken = async ({
    tokenHash,
    newTokenHash,
    newExpiresAt
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Find the existing refresh token
        const tokenResult = await client.query(
            `SELECT
                id,
                user_id,
                family_id,
                expires_at,
                is_revoked
             FROM refresh_tokens
             WHERE token_hash = $1
             LIMIT 1`,
            [tokenHash]
        );

        if (tokenResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return { status: "invalid" };
        }

        const token = tokenResult.rows[0];

        // 2. Lock this token family to prevent concurrent rotation
        await client.query(
            `SELECT pg_advisory_xact_lock(hashtext($1)::bigint)`,
            [token.family_id]
        );

        // 3. Re-read the token after acquiring the lock
        const lockedResult = await client.query(
            `SELECT
        rt.id,
        rt.user_id,
        rt.family_id,
        rt.expires_at,
        rt.is_revoked,
        u.is_active,
        u.name,
        u.email,
        u.role
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.id = $1
     FOR UPDATE OF rt`,
            [token.id]
        );

        const currentToken = lockedResult.rows[0];

        // 4. Detect reuse of an already-revoked token
        if (currentToken.is_revoked) {
            await client.query(
                `UPDATE refresh_tokens
                 SET is_revoked = TRUE,
                     revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
                 WHERE family_id = $1`,
                [currentToken.family_id]
            );

            await client.query("COMMIT");

            return { status: "reuse_detected" };
        }

        // 5. Check token expiration
        if (new Date(currentToken.expires_at) <= new Date()) {
            await client.query(
                `UPDATE refresh_tokens
                 SET is_revoked = TRUE,
                     revoked_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,
                [currentToken.id]
            );

            await client.query("COMMIT");

            return { status: "expired" };
        }

        // 6. Check account status
        if (!currentToken.is_active) {
            await client.query(
                `UPDATE refresh_tokens
                 SET is_revoked = TRUE,
                     revoked_at = CURRENT_TIMESTAMP
                 WHERE family_id = $1`,
                [currentToken.family_id]
            );

            await client.query("COMMIT");

            return { status: "inactive" };
        }

        // 7. Revoke the old refresh token
        await client.query(
            `UPDATE refresh_tokens
             SET is_revoked = TRUE,
                 revoked_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [currentToken.id]
        );

        // 8. Insert the replacement token in the same family
        const newTokenResult = await client.query(
            `INSERT INTO refresh_tokens
                (user_id, token_hash, family_id, expires_at)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, family_id, expires_at`,
            [
                currentToken.user_id,
                newTokenHash,
                currentToken.family_id,
                newExpiresAt
            ]
        );

        await client.query("COMMIT");

        return {
            status: "rotated",
            user: {
                id: currentToken.user_id,
                name: currentToken.name,
                email: currentToken.email,
                role: currentToken.role
            },
            familyId: currentToken.family_id,
            newToken: newTokenResult.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};

const createPasswordResetToken = async ({
  userId,
  tokenHash,
  expiresAt
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Invalidate any previous unused reset tokens for this user.
    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
         AND used_at IS NULL`,
      [userId]
    );

    const result = await client.query(
      `INSERT INTO password_reset_tokens
         (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, expires_at, created_at`,
      [userId, tokenHash, expiresAt]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findValidPasswordResetToken = async (tokenHash) => {
  const result = await pool.query(
    `SELECT
       prt.id AS reset_token_id,
       prt.user_id,
       prt.expires_at,
       u.name,
       u.email,
       u.role,
       u.is_active
     FROM password_reset_tokens prt
     JOIN users u ON u.id = prt.user_id
     WHERE prt.token_hash = $1
       AND prt.used_at IS NULL
       AND prt.expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash]
  );

  return result.rows[0] || null;
}; 

const resetPassword = async ({
  resetTokenId,
  userId,
  passwordHash
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the reset token to prevent concurrent use.
    const tokenResult = await client.query(
      `SELECT id
       FROM password_reset_tokens
       WHERE id = $1
         AND user_id = $2
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       FOR UPDATE`,
      [resetTokenId, userId]
    );

    if (tokenResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    // Update the user's password.
    const userResult = await client.query(
      `UPDATE users
       SET password_hash = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id`,
      [passwordHash, userId]
    );

    if (userResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    // Mark the reset token as consumed.
    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [resetTokenId]
    );

    // Revoke all refresh tokens so existing sessions cannot refresh.
    await client.query(
      `UPDATE refresh_tokens
       SET is_revoked = TRUE,
           revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
       WHERE user_id = $1
         AND is_revoked = FALSE`,
      [userId]
    );

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default {
    findUserByEmail,
    createUser,
    createRefreshToken,
    revokeRefreshToken,
    rotateRefreshToken,
    findValidPasswordResetToken,
    createPasswordResetToken,
    resetPassword
};
