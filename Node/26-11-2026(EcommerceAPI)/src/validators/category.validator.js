import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Category name must contain at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),

  is_active: z.boolean().optional(),
});

export const getCategoriesQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  is_active: z.enum(["true", "false"])
    .optional(),
});

export const categoryIdSchema = z.object({
  id: z.coerce
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Category name must contain at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),

  is_active: z.boolean().optional(),

}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  }
);
