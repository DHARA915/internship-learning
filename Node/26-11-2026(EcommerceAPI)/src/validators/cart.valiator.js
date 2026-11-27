import { z } from "zod";

export const addToCartSchema = z.object({
    product_id: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive(),
});

// Validate cart item ID from URL
export const cartItemIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

// Validate update quantity
export const updateCartItemSchema = z.object({
    quantity: z.coerce.number().int().positive(),
});
