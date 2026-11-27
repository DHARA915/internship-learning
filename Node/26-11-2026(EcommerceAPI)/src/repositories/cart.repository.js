
import pool from "../config/db.js";

class CartRepository {

    // For Add to Cart
    async findCartByUserId(userId) {
        const query = `
            SELECT id, user_id
            FROM carts
            WHERE user_id = $1
            LIMIT 1
        `;

        const result = await pool.query(query, [userId]);

        return result.rows[0] || null;
    }

    async createCart(userId) {
        const query = `
            INSERT INTO carts (user_id)
            VALUES ($1)
            RETURNING id, user_id
        `;

        const result = await pool.query(query, [userId]);

        return result.rows[0];
    }

    async findCartItem(cartId, productId) {
        const query = `
            SELECT id, cart_id, product_id, quantity
            FROM cart_items
            WHERE cart_id = $1 AND product_id = $2
            LIMIT 1
        `;

        const result = await pool.query(query, [cartId, productId]);

        return result.rows[0] || null;
    }

    async createCartItem(cartId, productId, quantity) {
        const query = `
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING id, cart_id, product_id, quantity
        `;

        const result = await pool.query(query, [
            cartId,
            productId,
            quantity,
        ]);

        return result.rows[0];
    }

    // async updateCartItemQuantity(itemId, quantity) {
    //     const query = `
    //         UPDATE cart_items
    //         SET quantity = $1,
    //             updated_at = CURRENT_TIMESTAMP
    //         WHERE id = $2
    //         RETURNING id, cart_id, product_id, quantity
    //     `;

    //     const result = await pool.query(query, [quantity, itemId]);

    //     return result.rows[0] || null;
    // }

    async updateCartItemQuantity(itemId, userId, quantity) {
        const query = `
        UPDATE cart_items ci
        SET quantity = $1,
            updated_at = CURRENT_TIMESTAMP
        FROM carts c
        WHERE ci.id = $2
          AND ci.cart_id = c.id
          AND c.user_id = $3
        RETURNING
            ci.id,
            ci.cart_id,
            ci.product_id,
            ci.quantity
    `;

        const result = await pool.query(query, [
            quantity,
            itemId,
            userId,
        ]);

        return result.rows[0] || null;
    }

    // Add ownership-check method
    async findCartItemByIdAndUserId(itemId, userId) {
        const query = `
        SELECT
            ci.id,
            ci.cart_id,
            ci.product_id,
            ci.quantity,
            p.stock,
            p.is_active
        FROM cart_items ci
        INNER JOIN carts c
            ON ci.cart_id = c.id
        INNER JOIN products p
            ON ci.product_id = p.id
        WHERE ci.id = $1
          AND c.user_id = $2
        LIMIT 1
    `;

        const result = await pool.query(query, [itemId, userId]);

        return result.rows[0] || null;
    }

    async findProductForCart(productId) {
        const query = `
        SELECT id, name, price, stock, is_active
        FROM products
        WHERE id = $1
        LIMIT 1
    `;

        const result = await pool.query(query, [productId]);

        return result.rows[0] || null;
    }

    // For Get items from cart 
    async findCartItemsByCartId(cartId) {
        const query = `
        SELECT
            ci.id AS cart_item_id,
            ci.cart_id,
            ci.product_id,
            ci.quantity,

            p.name AS product_name,
            p.price,
            p.image_url,
            p.stock,
            p.is_active,

            (p.price * ci.quantity) AS item_subtotal

        FROM cart_items ci
        INNER JOIN products p
            ON ci.product_id = p.id

        WHERE ci.cart_id = $1

        ORDER BY ci.created_at DESC
    `;

        const result = await pool.query(query, [cartId]);

        return result.rows;
    }

    // Delete Item From Cart
    async deleteCartItemByIdAndUserId(itemId, userId) {
        const query = `
        DELETE FROM cart_items AS ci
        USING carts AS c
        WHERE ci.id = $1
          AND ci.cart_id = c.id
          AND c.user_id = $2
        RETURNING
            ci.id,
            ci.cart_id,
            ci.product_id,
            ci.quantity
    `;

        const result = await pool.query(query, [itemId, userId]);

        return result.rows[0] || null;
    }

    // Clear Cart
    async clearCart(userId) {
        const query = `
        DELETE FROM cart_items AS ci
        USING carts AS c
        WHERE ci.cart_id = c.id
          AND c.user_id = $1
        RETURNING
            ci.id,
            ci.product_id,
            ci.quantity
    `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    }

}


export default new CartRepository();
