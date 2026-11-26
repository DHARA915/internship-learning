
import pool from "../config/db.js";

class UserRepository {
  // Find a user by email
  async findByEmail(email) {
    const query = `
      SELECT id, name, email, password_hash, role, is_active
      FROM users
      WHERE email = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
  }

  // Create a new user
  async create({ name, email, passwordHash }) {
    const query = `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        role,
        is_active,
        created_at
    `;

    const values = [name, email, passwordHash];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // For Login 
  async findById(id) {
  const query = `
    SELECT id, name, email, role, is_active
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
}

// ADMIN ACCESS ONLY.
async findAll({ limit, offset }) {
  const usersQuery = `
    SELECT
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC, id DESC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM users
  `;

  const [usersResult, countResult] = await Promise.all([
    pool.query(usersQuery, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    users: usersResult.rows,
    total: countResult.rows[0].total,
  };
}

async findByIdForAdmin(id) {
  const query = `
    SELECT
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
}

async update(id, updateData) {
  const {
    name,
    email,
    role,
    is_active,
  } = updateData;

  const query = `
    UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      role = COALESCE($3, role),
      is_active = COALESCE($4, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING
      id,
      name,
      email,
      role,
      is_active,
      created_at,
      updated_at
  `;

  const values = [
    name ?? null,
    email ?? null,
    role ?? null,
    is_active ?? null,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
}

}

export default new UserRepository();
