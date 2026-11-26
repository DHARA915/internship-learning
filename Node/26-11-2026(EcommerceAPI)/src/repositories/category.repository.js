import pool from "../config/db.js";

class CategoryRepository {

    async findByName(name) {
        const query = `
    SELECT id, name
    FROM categories
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
    LIMIT 1
  `;

        const result = await pool.query(query, [name]);

        return result.rows[0] || null;
    }

    async create({ name, is_active }) {
        const query = `
      INSERT INTO categories (
        name,
        is_active
      )
      VALUES ($1, COALESCE($2, TRUE))
      RETURNING
        id,
        name,
        is_active,
        created_at,
        updated_at
    `;

        const values = [
            name,
            is_active ?? null,
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    async findAll({ limit, offset, is_active }) {
        const query = `
    SELECT
      id,
      name,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE ($1::BOOLEAN IS NULL OR is_active = $1)
    ORDER BY created_at DESC, id DESC
    LIMIT $2
    OFFSET $3
  `;

        const values = [is_active ?? null, limit, offset];

        const result = await pool.query(query, values);

        return result.rows;
    }

    async findById(id) {
        const query = `
    SELECT
      id,
      name,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE id = $1
    LIMIT 1
  `;

        const result = await pool.query(query, [id]);

        return result.rows[0] || null;
    }

    async update(id, { name, is_active }) {
        const query = `
    UPDATE categories
    SET
      name = COALESCE($1, name),
      is_active = COALESCE($2, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING
      id,
      name,
      is_active,
      created_at,
      updated_at
  `;

        const values = [
            name ?? null,
            is_active ?? null,
            id,
        ];

        const result = await pool.query(query, values);

        return result.rows[0] || null;
    }

}

export default new CategoryRepository();