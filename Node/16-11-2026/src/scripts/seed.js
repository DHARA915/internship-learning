
import { faker } from "@faker-js/faker";
import pool from "../config/db.js";

// Generate SQL placeholders for bulk INSERT
function generatePlaceholders(rowCount, columnCount) {
    const placeholders = [];
    let parameterIndex = 1;

    for (let i = 0; i < rowCount; i++) {
        const row = [];

        for (let j = 0; j < columnCount; j++) {
            row.push(`$${parameterIndex++}`);
        }

        placeholders.push(`(${row.join(", ")})`);
    }

    return placeholders.join(", ");
}

// Flatten rows into one array of parameter values
function flattenRows(rows) {
    return rows.flat();
}

async function seedDatabase() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Create or reuse categories
        const categoryNames = [
            "Electronics",
            "Clothing",
            "Home & Kitchen",
            "Books",
            "Sports",
            "Beauty",
            "Toys",
            "Furniture",
            "Accessories",
            "Stationery"
        ];

        const categoryRows = categoryNames.map((name) => [
            name,
            faker.lorem.sentence()
        ]);

        const categoryPlaceholders = generatePlaceholders(
            categoryRows.length,
            2
        );

        await client.query(
            `INSERT INTO categories (name, description)
             VALUES ${categoryPlaceholders}
             ON CONFLICT (name) DO NOTHING`,
            flattenRows(categoryRows)
        );

        // Get category IDs for product foreign keys
        const categoryResult = await client.query(
            `SELECT id, name FROM categories`
        );

        const categoryIds = categoryResult.rows.map(
            (category) => category.id
        );

        // 2. Generate 100 users
        const users = Array.from({ length: 100 }, (_, index) => [
            faker.person.fullName(),
            `seed.${Date.now()}.${index + 1}.${faker.internet.email().toLowerCase()}`,
            "seed_test_hash_not_for_login",
            faker.helpers.arrayElement(["user", "admin"])
        ]);

        const userPlaceholders = generatePlaceholders(
            users.length,
            4
        );

        const userQuery = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ${userPlaceholders}
            RETURNING id
        `;

        const userResult = await client.query(
            userQuery,
            flattenRows(users)
        );

        // 3. Generate 500 products
        const products = Array.from({ length: 500 }, () => [
            faker.commerce.productName(),
            faker.lorem.sentence(),
            faker.number.float({
                min: 5,
                max: 2000,
                fractionDigits: 2
            }),
            faker.number.int({ min: 0, max: 500 }),
            faker.helpers.arrayElement(categoryIds)
        ]);

        const productPlaceholders = generatePlaceholders(
            products.length,
            5
        );

        const productQuery = `
            INSERT INTO products
                (name, description, price, stock, category_id)
            VALUES ${productPlaceholders}
            RETURNING id
        `;

        const productResult = await client.query(
            productQuery,
            flattenRows(products)
        );

        // 4. Commit transaction
        await client.query("COMMIT");

        console.log("Database seeding completed successfully!");
        console.log("Users inserted:", userResult.rowCount);
        console.log("Products inserted:", productResult.rowCount);
        console.log("Categories available:", categoryIds.length);

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Database seeding failed:", error.message);

    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();
