import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.coerce.number().int().positive().nullable().optional(),

  name: z.string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters"),

  description: z.string().trim().nullable().optional(),

  price: z.coerce.number()
    .min(0, "Price cannot be negative"),

  stock: z.coerce.number()
    .int()
    .min(0, "Stock cannot be negative")
    .optional(),

  image_url: z.string().url("Invalid image URL").nullable().optional(),

  is_active: z.boolean().optional(),
});


export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  category_id: z.coerce.number().int().positive().optional(),

  min_price: z.coerce.number().min(0).optional(),

  max_price: z.coerce.number().min(0).optional(),

  sort_by: z.enum(["name", "price", "created_at"]).default("created_at"),

  sort_order: z.enum(["asc", "desc"]).default("desc"),
}).refine(
  (data) =>
    data.min_price === undefined ||
    data.max_price === undefined ||
    data.min_price <= data.max_price,
  {
    message: "Minimum price cannot be greater than maximum price",
    path: ["min_price"],
  }
);

export const updateProductSchema = z.object({
    category_id: z.coerce.number().int().positive().nullable().optional(),

    name: z.string().trim().min(2).max(200).optional(),

    description: z.string().trim().nullable().optional(),

    price: z.coerce.number().min(0).optional(),

    stock: z.coerce.number().int().min(0).optional(),
    
    is_active: z.boolean().optional(),
    
    image_url: z.string().url().nullable().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided",
    }
);

