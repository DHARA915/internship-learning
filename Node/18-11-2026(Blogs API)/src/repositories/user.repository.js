import pool from "../config/database.js";

const findById = async (userId) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       email,
       role,
       is_active,
       created_at,
       updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, email
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
};

const findAll = async ({ limit, offset }) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       email,
       role,
       is_active,
       created_at,
       updated_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)::INTEGER AS total
     FROM users`
  );

  return {
    users: result.rows,
    total: countResult.rows[0].total
  };
};

const updateUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.email !== undefined) {
    fields.push(`email = $${paramIndex++}`);
    values.push(updates.email);
  }

  if (updates.role !== undefined) {
    fields.push(`role = $${paramIndex++}`);
    values.push(updates.role);
  }

  if (updates.is_active !== undefined) {
    fields.push(`is_active = $${paramIndex++}`);
    values.push(updates.is_active);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  values.push(userId);

  const result = await pool.query(
    `UPDATE users
     SET ${fields.join(", ")}
     WHERE id = $${paramIndex}
     RETURNING
       id,
       name,
       email,
       role,
       is_active,
       created_at,
       updated_at`,
    values
  );

  return result.rows[0] || null;
};

// delete user
const deleteUser = async (userId) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, name, email, role`,
    [userId]
  );

  return result.rows[0] || null;
};


export default {
  findById,
  findAll,
  findUserByEmail,
  updateUser,
  deleteUser
};