
import pool from "../config/db.js";

class UserRepository {

    // 1. Find user by ID
    async findById(id) {

        const query = `
            SELECT id, name, email, role, created_at, updated_at
            FROM users
            WHERE id = $1
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0] || null;
    }

    // 2. Find user by Email
    async findByEmail(email) {

        const query = `
            SELECT id, name, email, role, created_at, updated_at
            FROM users
            WHERE email = $1
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0] || null;
    }

    // 3. Create user
    async create({ name, email, passwordHash, role }) {

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at, updated_at`,
            [name, email, passwordHash, role]
        );

        return result.rows[0];
    }

    // 4. Update user
    async update(id, userData) {

        const { name, email, password_hash, role } = userData;

        const query = `
            UPDATE users
            SET
                name = $1,
                email = $2,
                password_hash = $3,
                role = $4,
                updated_at = NOW()
            WHERE id = $5
            RETURNING id, name, email, role, created_at, updated_at
        `;

        const values = [name, email, password_hash, role, id];

        const result = await pool.query(query, values);

        return result.rows[0] || null;
    }

    // 5. Delete user
    async delete(id) {

        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id, name, email
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0] || null;
    }

    // 6. Find all users with filters
    async findAll(filters = {}) {

        const { name, email, role } = filters;

        const conditions = [];
        const values = [];

        if (name) {
            values.push(`%${name}%`);
            conditions.push(`name ILIKE $${values.length}`);
        }

        if (email) {
            values.push(`%${email}%`);
            conditions.push(`email ILIKE $${values.length}`);
        }

        if (role) {
            values.push(role);
            conditions.push(`role = $${values.length}`);
        }

        let query = `
            SELECT id, name, email, role, created_at, updated_at
            FROM users
        `;

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += ` ORDER BY id ASC`;

        const result = await pool.query(query, values);

        return result.rows;
    }

    // 7. pagination using offset and limit
    async findAllPaginated(page, limit) {

        // Calculate how many records to skip
        const offset = (page - 1) * limit;

        // Fetch users for the requested page
        const usersQuery = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        ORDER BY id ASC
        LIMIT $1 OFFSET $2
    `;

        const usersResult = await pool.query(
            usersQuery,
            [limit, offset]
        );

        // Get total number of users
        const countQuery = `
        SELECT COUNT(*) AS total
        FROM users
    `;

        const countResult = await pool.query(countQuery);

        const totalItems = Number(countResult.rows[0].total);

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limit);

        return {
            users: usersResult.rows,
            page,
            limit,
            totalItems,
            totalPages
        };
    }

    // 8.cursor based pagination

   async findAllWithCursor(cursor, limit) {
    // Fetch one extra record to check whether another page exists
    const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id > $1
        ORDER BY id ASC
        LIMIT $2
    `;

    const result = await pool.query(
        query,
        [cursor, limit + 1]
    );

    // Check whether another page exists
    const hasMore = result.rows.length > limit;

    // Remove the extra record
    const users = result.rows.slice(0, limit);

    // Last user's ID becomes the next cursor
    const nextCursor = hasMore
        ? users[users.length - 1].id
        : null;

    return {
        users,
        nextCursor,
        hasMore
    };
}

}

export default new UserRepository();
