import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { addToCartSchema , cartItemIdSchema , updateCartItemSchema  } from "../validators/cart.valiator.js";

const router = Router();

// Add product to cart
router.post(
    "/items",
    authenticate,
    authorize("customer"),
    validate(addToCartSchema),
    cartController.addToCart
);

// Get customer's cart
router.get(
    "/",
    authenticate,
    authorize("customer"),
    cartController.getMyCart
);

// Update cart item quantity
router.patch(
    "/items/:id",
    authenticate,
    authorize("customer"),
    validate(cartItemIdSchema, "params"),
    validate(updateCartItemSchema),
    cartController.updateCartItem
);

// Remove Item from cart 
router.delete(
    "/items/:id",
    authenticate,
    authorize("customer"),
    validate(cartItemIdSchema, "params"),
    cartController.removeCartItem
);

// Clear Cart
router.delete(
    "/",
    authenticate,
    authorize("customer"),
    cartController.clearCart
);

export default router;