import { z } from "zod";

export const userListQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  offset: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
}).strict();

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255)
    .transform((value) => value.toLowerCase())
    .optional(),

  role: z
    .enum(["admin", "author", "reader"])
    .optional(),

  is_active: z
    .boolean()
    .optional()
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided"
  }
);