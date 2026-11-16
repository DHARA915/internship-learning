
import pool from "../config/db.js";

class ProductRepository {

    async updateWithVersion(id, productData, expectedVersion) {

        const {
            name,
            description,
            price,
            stock,
            category_id
        } = productData;

        // Update only when the supplied version matches
        const query = `
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                stock = $4,
                category_id = $5,
                version = version + 1,
                updated_at = NOW()
            WHERE id = $6 AND version = $7
            RETURNING id, name, description, price,
                      stock, category_id, version, updated_at
        `;

        const values = [
            name,
            description,
            price,
            stock,
            category_id,
            id,
            expectedVersion
        ];

        const result = await pool.query(query, values);

        // Update succeeded
        if (result.rowCount > 0) {
            return {
                status: "updated",
                product: result.rows[0]
            };
        }

        // Check whether the product exists
        const existingProduct = await pool.query(
            "SELECT id, version FROM products WHERE id = $1",
            [id]
        );

        if (existingProduct.rowCount === 0) {
            return {
                status: "not_found"
            };
        }

        // Product exists, but its version has changed
        return {
            status: "conflict",
            currentVersion: existingProduct.rows[0].version
        };
    }


async findProductsWithDetails(page, limit) {

    const offset = (page - 1) * limit;

    // Join products, categories and users
    const productsQuery = `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.created_at,

            jsonb_build_object(
                'id', c.id,
                'name', c.name
            ) AS category,

            CASE
                WHEN u.id IS NULL THEN NULL
                ELSE jsonb_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email
                )
            END AS creator

        FROM products p

        INNER JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN users u
            ON p.created_by = u.id

        ORDER BY p.id ASC

        LIMIT $1 OFFSET $2
    `;

    const productsResult = await pool.query(
        productsQuery,
        [limit, offset]
    );

    // Count total products
    const countQuery = `
        SELECT COUNT(*) AS total
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.id
    `;

    const countResult = await pool.query(countQuery);

    const totalItems = Number(countResult.rows[0].total);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        products: productsResult.rows,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}

}

export default new ProductRepository();
