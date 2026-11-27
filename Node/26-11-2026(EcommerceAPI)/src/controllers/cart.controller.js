import cartService from "../services/cart.service.js";

class CartController {

    async addToCart(req, res, next) {
        try {
            // Get the authenticated user's ID
            const userId = req.user.id;

            // Get product details from request body
            const { product_id, quantity } = req.body;

            // Call service
            const cartItem = await cartService.addToCart(
                userId,
                product_id,
                quantity
            );

            // Send response
            return res.status(201).json({
                success: true,
                message: "Product added to cart successfully",
                data: cartItem,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyCart(req, res, next) {
        try {
            // Get authenticated user's ID
            const userId = req.user.id;

            // Call service
            const cart = await cartService.getMyCart(userId);

            // Send response
            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCartItem(req, res, next) {
        try {
            // Get authenticated customer's ID
            const userId = req.user.id;

            // Get cart item ID from URL
            const itemId = res.locals.validated.params.id;

            // Get new quantity from request body
            const { quantity } = req.body;

            // Call service
            const updatedItem = await cartService.updateCartItem(
                userId,
                itemId,
                quantity
            );

            return res.status(200).json({
                success: true,
                message: "Cart item quantity updated successfully",
                data: updatedItem,
            });
        } catch (error) {
            next(error);
        }
    }

    async removeCartItem(req, res, next) {
        try {
            const userId = req.user.id;
            const itemId = res.locals.validated.params.id;

            const deletedItem = await cartService.removeCartItem(
                userId,
                itemId
            );

            res.status(200).json({
                success: true,
                message: "Cart item removed successfully",
                data: deletedItem,
            });
        } catch (error) {
            next(error);
        }
    }

    // Clear Cart
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id;

            const result = await cartService.clearCart(userId);

            res.status(200).json({
                success: true,
                message: "Cart cleared successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new CartController();