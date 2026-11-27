import pool from "../config/db.js";

class OrderRepository {

    async executeTransaction(callback) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const result = await callback(client);

            await client.query("COMMIT");

            return result;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
    }

    // Fetch and lock cart products
    async findCartItemsForOrder(client, userId) {
        const query = `
        SELECT
            ci.id AS cart_item_id,
            ci.cart_id,
            ci.product_id,
            ci.quantity,

            p.name AS product_name,
            p.price AS unit_price,
            p.stock,
            p.is_active

        FROM carts c

        INNER JOIN cart_items ci
            ON c.id = ci.cart_id

        INNER JOIN products p
            ON ci.product_id = p.id

        WHERE c.user_id = $1

        ORDER BY ci.id

        FOR UPDATE OF p
    `;

        const result = await client.query(query, [userId]);

        return result.rows;
    }

    // Create the order record
    async createOrder(client, {
        userId,
        orderNumber,
        subtotal,
        totalAmount
    }) {
        const query = `
        INSERT INTO orders (
            user_id,
            order_number,
            status,
            payment_status,
            subtotal,
            total_amount
        )
        VALUES ($1, $2, 'pending', 'pending', $3, $4)

        RETURNING
            id,
            user_id,
            order_number,
            status,
            payment_status,
            subtotal,
            total_amount,
            created_at
    `;

        const values = [
            userId,
            orderNumber,
            subtotal,
            totalAmount
        ];

        const result = await client.query(query, values);

        return result.rows[0];
    }

    // Insert order items
    async createOrderItems(client, orderId, cartItems) {
        if (cartItems.length === 0) {
            return [];
        }

        const values = [];

        const placeholders = cartItems.map((item, index) => {
            const base = index * 5;

            values.push(
                orderId,
                item.product_id,
                item.product_name,
                item.quantity,
                item.unit_price
            );

            return `(
            $${base + 1},
            $${base + 2},
            $${base + 3},
            $${base + 4},
            $${base + 5}
        )`;
        });

        const query = `
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price
        )
        VALUES ${placeholders.join(",")}

        RETURNING
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price
    `;

        const result = await client.query(query, values);

        return result.rows;
    }

    // Deduct product stock 
    async decreaseProductStock(client, productId, quantity) {
        const query = `
        UPDATE products
        SET
            stock = stock - $1,
            updated_at = NOW()
        WHERE
            id = $2
            AND stock >= $1
            AND is_active = TRUE
        RETURNING id, stock
    `;

        const values = [quantity, productId];

        const result = await client.query(query, values);

        return result.rows[0] || null;
    }

    // Clear Cart
    async clearCartItems(client, userId) {
        const query = `
        DELETE FROM cart_items ci
        USING carts c
        WHERE
            ci.cart_id = c.id
            AND c.user_id = $1
        RETURNING ci.id
    `;

        const result = await client.query(query, [userId]);

        return result.rows;
    }

    // Get all orders with their items for a customer
    async findOrdersByUserId(userId) {
        const query = `
        SELECT
            o.id,
            o.user_id,
            o.order_number,
            o.status,
            o.payment_status,
            o.subtotal,
            o.total_amount,
            o.created_at,
            o.updated_at,

            COALESCE(
                json_agg(
                    json_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'product_name', oi.product_name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'item_subtotal', oi.quantity * oi.unit_price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'::json
            ) AS items

        FROM orders o

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        WHERE o.user_id = $1

        GROUP BY o.id

        ORDER BY o.created_at DESC
    `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    }

    // Find a specific order belonging to a customer, including its items
    async findOrderByIdAndUserId(orderId, userId) {
        const query = `
        SELECT
            o.id,
            o.user_id,
            o.order_number,
            o.status,
            o.payment_status,
            o.subtotal,
            o.total_amount,
            o.created_at,
            o.updated_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'product_name', oi.product_name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'item_subtotal', oi.quantity * oi.unit_price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'::json
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1 AND o.user_id = $2
        GROUP BY o.id
    `;

        const result = await pool.query(query, [orderId, userId]);

        return result.rows[0] || null;
    }

    // Find an order belonging to a specific customer
    async findOrderForCancellation(client, orderId, userId) {
        const query = `
        SELECT id, user_id, status
        FROM orders
        WHERE id = $1 AND user_id = $2
        FOR UPDATE
    `;

        const result = await client.query(query, [orderId, userId]);

        return result.rows[0] || null;
    }

    // Get the products and quantities belonging to an order
    async findOrderItemsForCancellation(client, orderId) {
        const query = `
        SELECT product_id, quantity
        FROM order_items
        WHERE order_id = $1
        ORDER BY product_id
    `;

        const result = await client.query(query, [orderId]);

        return result.rows;
    }

    // Restore product stock after cancellation
    async restoreProductStock(client, productId, quantity) {
        const query = `
        UPDATE products
        SET stock = stock + $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, stock
    `;

        const result = await client.query(query, [quantity, productId]);

        return result.rows[0] || null;
    }

    // Update order status to cancelled
    async cancelOrder(client, orderId) {
        const query = `
        UPDATE orders
        SET status = 'cancelled',
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, status, updated_at
    `;

        const result = await client.query(query, [orderId]);

        return result.rows[0] || null;
    }

}

export default new OrderRepository();