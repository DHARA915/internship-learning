
import pool from "../config/db.js";

class RefreshTokenRepository {

  // Save a refresh token
  async create({ userId, tokenHash, familyId, expiresAt }) {
    const query = `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        family_id,
        expires_at
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, family_id, expires_at, is_revoked
    `;

    const values = [userId, tokenHash, familyId, expiresAt];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Find token using its hash
  async findByTokenHash(tokenHash) {
    const query = `
      SELECT
        id,
        user_id,
        token_hash,
        family_id,
        expires_at,
        is_revoked
      FROM refresh_tokens
      WHERE token_hash = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [tokenHash]);

    return result.rows[0] || null;
  }

  // Revoke one refresh token
  async revokeById(id) {
    const query = `
      UPDATE refresh_tokens
      SET
        is_revoked = TRUE,
        revoked_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND is_revoked = FALSE
      RETURNING id
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  // Revoke all tokens belonging to a family
  async revokeFamily(familyId) {
    const query = `
      UPDATE refresh_tokens
      SET
        is_revoked = TRUE,
        revoked_at = CURRENT_TIMESTAMP
      WHERE family_id = $1
        AND is_revoked = FALSE
    `;

    const result = await pool.query(query, [familyId]);

    return result.rowCount;
  }

  // RotateToken
  async rotateToken({ tokenHash, newTokenHash, newExpiresAt }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Find and lock the existing refresh token.
      const tokenResult = await client.query(
        `
        SELECT
          id,
          user_id,
          family_id,
          expires_at,
          is_revoked
        FROM refresh_tokens
        WHERE token_hash = $1
        FOR UPDATE
      `,
        [tokenHash]
      );

      const existingToken = tokenResult.rows[0];

      if (!existingToken) {
        await client.query("COMMIT");
        return { status: "not_found" };
      }

      // Detect reuse of an already-revoked token.
      if (existingToken.is_revoked) {
        await client.query(
          `
          UPDATE refresh_tokens
          SET
            is_revoked = TRUE,
            revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
          WHERE family_id = $1
        `,
          [existingToken.family_id]
        );

        await client.query("COMMIT");
        return { status: "reuse_detected" };
      }

      // Check token expiration.
      if (new Date(existingToken.expires_at) <= new Date()) {
        await client.query(
          `
          UPDATE refresh_tokens
          SET is_revoked = TRUE,
              revoked_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
          [existingToken.id]
        );

        await client.query("COMMIT");
        return { status: "expired" };
      }

      // Revoke the old refresh token.
      await client.query(
        `
        UPDATE refresh_tokens
        SET is_revoked = TRUE,
            revoked_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [existingToken.id]
      );

      // Store the new refresh token in the same family.
      const newTokenResult = await client.query(
        `
        INSERT INTO refresh_tokens (
          user_id,
          token_hash,
          family_id,
          expires_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, family_id, expires_at
      `,
        [
          existingToken.user_id,
          newTokenHash,
          existingToken.family_id,
          newExpiresAt,
        ]
      );

      await client.query("COMMIT");

      return {
        status: "rotated",
        token: newTokenResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // RovokeToken for Logout
  async revokeByTokenHash(tokenHash) {
  const query = `
    UPDATE refresh_tokens
    SET
      is_revoked = TRUE,
      revoked_at = CURRENT_TIMESTAMP
    WHERE token_hash = $1
      AND is_revoked = FALSE
    RETURNING id
  `;

  const result = await pool.query(query, [tokenHash]);

  return result.rows[0] || null;
}

}

export default new RefreshTokenRepository();
