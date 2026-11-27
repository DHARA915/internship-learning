import cartRepository from "../repositories/cart.repository.js";

class CartService {

    // Add to Cart
    async addToCart(userId, productId, quantity) {
        // 1. Check whether the product exists
        const product = await cartRepository.findProductForCart(productId);

        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        // 2. Check whether the product is active
        if (!product.is_active) {
            const error = new Error("Product is not available");
            error.statusCode = 400;
            throw error;
        }

        // 3. Check whether the requested quantity is available
        if (quantity > product.stock) {
            const error = new Error("Insufficient stock");
            error.statusCode = 400;
            throw error;
        }

        // 4. Find the user's cart
        let cart = await cartRepository.findCartByUserId(userId);

        // 5. Create a cart if it doesn't exist
        if (!cart) {
            cart = await cartRepository.createCart(userId);
        }

        // 6. Check whether the product is already in the cart
        const existingItem = await cartRepository.findCartItem(
            cart.id,
            productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            // 7. Check stock against the combined quantity
            if (newQuantity > product.stock) {
                const error = new Error("Insufficient stock");
                error.statusCode = 400;
                throw error;
            }

            return await cartRepository.updateCartItemQuantity(
                existingItem.id,
                userId,
                newQuantity
            );
        }

        // 8. Add a new product to the cart
        return await cartRepository.createCartItem(
            cart.id,
            productId,
            quantity
        );
    }

    // Get My Cart
    async getMyCart(userId) {
        // 1. Find customer's cart
        const cart = await cartRepository.findCartByUserId(userId);

        // 2. Return empty cart if it doesn't exist
        if (!cart) {
            return {
                cart_id: null,
                items: [],
                total_items: 0,
                total_amount: 0,
            };
        }

        // 3. Fetch cart items with product details
        const items = await cartRepository.findCartItemsByCartId(cart.id);

        // 4. Calculate total quantity
        const totalItems = items.reduce(
            (total, item) => total + Number(item.quantity),
            0
        );

        // 5. Calculate total cart amount
        const totalAmount = items.reduce(
            (total, item) => total + Number(item.item_subtotal),
            0
        );

        // 6. Return cart details
        return {
            cart_id: cart.id,
            items,
            total_items: totalItems,
            total_amount: totalAmount.toFixed(2),
        };
    }

    // Update Cart
    async updateCartItem(userId, itemId, quantity) {
        // 1. Find cart item and verify ownership
        const cartItem = await cartRepository.findCartItemByIdAndUserId(
            itemId,
            userId
        );

        if (!cartItem) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }

        // 2. Check whether product is active
        if (!cartItem.is_active) {
            const error = new Error("Product is not available");
            error.statusCode = 400;
            throw error;
        }

        // 3. Check available stock
        if (quantity > cartItem.stock) {
            const error = new Error("Insufficient stock");
            error.statusCode = 400;
            throw error;
        }

        // 4. Update cart item quantity
        return await cartRepository.updateCartItemQuantity(
            itemId,
            userId,
            quantity
        );
    }

    // Remove Item from cart 
    async removeCartItem(userId, itemId) {
        // 1. Delete cart item after verifying ownership
        const deletedItem =
            await cartRepository.deleteCartItemByIdAndUserId(
                itemId,
                userId
            );

        // 2. Check whether item was found
        if (!deletedItem) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }

        // 3. Return deleted item
        return deletedItem;
    }

    // Clear Cart
    async clearCart(userId) {
        const deletedItems = await cartRepository.clearCart(userId);

        return {
            deleted_count: deletedItems.length,
            deleted_items: deletedItems,
        };
    }

}

export default new CartService();