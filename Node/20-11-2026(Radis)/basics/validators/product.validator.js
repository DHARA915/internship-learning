import { z } from "zod";

export const productSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),

    sku: z.string().trim().min(1, "SKU is required"),

    category: z.string().optional(),

    description: z.string().optional(),

    price: z.coerce.number().positive("Price must be greater than 0"),

    stock_quantity: z.coerce.number().int().min(0).optional(),

    tags: z.array(z.string()).optional(),

    metadata: z.record(z.string(), z.any()).optional(),

    related_product_id: z.number().int().positive().nullable().optional()
});