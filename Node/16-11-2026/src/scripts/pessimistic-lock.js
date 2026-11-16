
import pool from "../config/db.js";

const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

async function simulateLocking() {

    // Get two separate database connections
    const client1 = await pool.connect();
    const client2 = await pool.connect();

    let transaction1Started = false;
    let transaction2Started = false;

    const productId = Number(process.argv[2] || 1);

    try {

        if (!Number.isSafeInteger(productId) || productId <= 0) {
            throw new Error("Please provide a valid product ID");
        }

        console.log("\nTransaction 1: Starting...");

        // TRANSACTION 1
        await client1.query("BEGIN");
        transaction1Started = true;

        // Lock the product row
        const result1 = await client1.query(
            `SELECT id, name, price, version
             FROM products
             WHERE id = $1
             FOR UPDATE`,
            [productId]
        );

        if (result1.rowCount === 0) {
            throw new Error("Product not found");
        }

        console.log("Transaction 1: Product locked!");
        console.log("Product:", result1.rows[0]);

        // TRANSACTION 2
        console.log("\nTransaction 2: Starting...");

        await client2.query("BEGIN");
        transaction2Started = true;

        console.log("Transaction 2: Trying to acquire lock...");

        // This query waits because Transaction 1 holds the lock
        const secondLockPromise = client2.query(
            `SELECT id, name, price, version
             FROM products
             WHERE id = $1
             FOR UPDATE`,
            [productId]
        );

        console.log("Transaction 2: Waiting for Transaction 1...");

        // Keep Transaction 1 open for 3 seconds
        await delay(3000);

        // Transaction 1 updates the product
        console.log("\nTransaction 1: Updating product...");

        const update1 = await client1.query(
            `UPDATE products
             SET price = price + 100,
                 version = version + 1,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, name, price, version`,
            [productId]
        );

        console.log("Transaction 1 updated:", update1.rows[0]);

        // Release the lock
        await client1.query("COMMIT");
        transaction1Started = false;

        console.log("Transaction 1: COMMITTED. Lock released!");

        // Transaction 2 now receives the locked row
        const result2 = await secondLockPromise;

        console.log("\nTransaction 2: Lock acquired!");
        console.log("Latest product:", result2.rows[0]);

        // Transaction 2 updates the same product
        const update2 = await client2.query(
            `UPDATE products
             SET price = price + 200,
                 version = version + 1,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, name, price, version`,
            [productId]
        );

        console.log("Transaction 2 updated:", update2.rows[0]);

        await client2.query("COMMIT");
        transaction2Started = false;

        console.log("\nTransaction 2: COMMITTED!");

    } catch (error) {

        console.error("Lock simulation failed:", error.message);

        if (transaction2Started) {
            await client2.query("ROLLBACK");
        }

        if (transaction1Started) {
            await client1.query("ROLLBACK");
        }

    } finally {

        client1.release();
        client2.release();

        await pool.end();
    }
}

simulateLocking();
