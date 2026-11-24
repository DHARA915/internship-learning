
import pool from "../config/db.js";

const productRepository = {

    // Find product by ID
    async findById(id) {
        const query = `
            SELECT *
            FROM products
            WHERE id = $1
        `;

        const { rows } = await pool.query(query, [id]);

        return rows[0] || null;
    },

    // Get all products with pagination
    async findAll({ limit = 10, offset = 0 } = {}) {
        const query = `
            SELECT *
            FROM products
            ORDER BY id ASC
            LIMIT $1 OFFSET $2
        `;

        const { rows } = await pool.query(query, [limit, offset]);

        return rows;
    },

    // Create product
    async create(productData) {
        const {
            name,
            sku,
            category,
            description,
            price,
            stock_quantity,
            tags,
            metadata,
            related_product_id
        } = productData;

        const query = `
            INSERT INTO products (
                name,
                sku,
                category,
                description,
                price,
                stock_quantity,
                tags,
                metadata,
                related_product_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const values = [
            name,
            sku,
            category,
            description,
            price,
            stock_quantity,
            tags,
            metadata,
            related_product_id
        ];

        const { rows } = await pool.query(query, values);

        return rows[0];
    },

    // Update product dynamically
    async update(id, updates) {
        const allowedFields = new Set([
            "name",
            "sku",
            "category",
            "description",
            "price",
            "stock_quantity",
            "tags",
            "metadata",
            "related_product_id"
        ]);

        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            throw new Error("Updates must be an object");
        }

        const entries = Object.entries(updates);

        if (entries.length === 0) {
            throw new Error("No fields provided for update");
        }

        const invalidFields = entries
            .filter(([field]) => !allowedFields.has(field))
            .map(([field]) => field);

        if (invalidFields.length > 0) {
            throw new Error(
                `Invalid update fields: ${invalidFields.join(", ")}`
            );
        }

        const validEntries = entries.filter(
            ([, value]) => value !== undefined
        );

        if (validEntries.length === 0) {
            throw new Error("No valid fields provided for update");
        }

        const setClauses = validEntries.map(
            ([field], index) => `${field} = $${index + 1}`
        );

        const values = validEntries.map(([, value]) => value);

        values.push(id);

        const query = `
            UPDATE products
            SET ${setClauses.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
        `;

        const { rows } = await pool.query(query, values);

        return rows[0] || null;
    },

    // Delete product
    async delete(id) {
        const query = `
            DELETE FROM products
            WHERE id = $1
            RETURNING *
        `;

        const { rows } = await pool.query(query, [id]);

        return rows[0] || null;
    }

};

export default productRepository;
