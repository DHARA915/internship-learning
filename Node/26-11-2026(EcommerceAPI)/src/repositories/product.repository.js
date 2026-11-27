
import pool from "../config/db.js";

class ProductRepository {

    async create({
        category_id,
        name,
        description,
        price,
        stock,
        image_url,
    }) {
        const query = `
      INSERT INTO products (
        category_id,
        name,
        description,
        price,
        stock,
        image_url,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING
        id,
        category_id,
        name,
        description,
        price,
        stock,
        image_url,
        is_active,
        created_at,
        updated_at
    `;

        const values = [
            category_id ?? null,
            name,
            description ?? null,
            price,
            stock ?? 0,
            image_url ?? null,
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    async findAll({
        limit,
        offset,
        search,
        category_id,
        min_price,
        max_price,
        sort_by,
        sort_order,
    }) {
        const conditions = ["is_active = TRUE"];
        const values = [];

        // Search by product name
        if (search) {
            values.push(`%${search}%`);
            conditions.push(`name ILIKE $${values.length}`);
        }

        // Filter by category
        if (category_id !== undefined) {
            values.push(category_id);
            conditions.push(`category_id = $${values.length}`);
        }

        // Minimum price filter
        if (min_price !== undefined) {
            values.push(min_price);
            conditions.push(`price >= $${values.length}`);
        }

        // Maximum price filter
        if (max_price !== undefined) {
            values.push(max_price);
            conditions.push(`price <= $${values.length}`);
        }

        // Allow only predefined sorting columns
        const sortColumns = {
            name: "name",
            price: "price",
            created_at: "created_at",
        };

        const sortColumn = sortColumns[sort_by] || "created_at";
        const sortDirection = sort_order === "asc" ? "ASC" : "DESC";

        // Pagination
        values.push(limit);
        const limitPlaceholder = `$${values.length}`;

        values.push(offset);
        const offsetPlaceholder = `$${values.length}`;

        const query = `
    SELECT
      id,
      category_id,
      name,
      description,  
      price,
      stock,
      image_url,
      is_active,
      created_at,
      updated_at,
      COUNT(*) OVER() AS total_count
    FROM products
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${sortColumn} ${sortDirection}, id DESC    
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;

        const result = await pool.query(query, values);

        return {
            products: result.rows,
            total: Number(result.rows[0]?.total_count ?? 0),
        };
    }

    async update(id, {
        category_id,
        name,
        description,
        price,
        stock,
        image_url,
        is_active,
    }) {
        const query = `
        UPDATE products
        SET
            category_id = $1,
            name = $2,
            description = $3,
            price = $4,
            stock = $5,
            image_url = $6,
            is_active = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING
            id,
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            is_active,
            created_at,
            updated_at
    `;

        const values = [
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            is_active,
            id,
        ];

        const result = await pool.query(query, values);

        return result.rows[0] || null;
    }

    async findById(id) {
        const query = `
        SELECT
            id,
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            is_active,
            created_at,
            updated_at
        FROM products
        WHERE id = $1
        LIMIT 1
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0] || null;
    }

}

export default new ProductRepository();