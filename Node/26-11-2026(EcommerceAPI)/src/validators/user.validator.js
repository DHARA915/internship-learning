import { z } from "zod";

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const userIdSchema = z.object({
  id: z.string()
    .regex(/^[1-9]\d*$/, "User ID must be a positive integer")
    .refine(
      (id) => BigInt(id) <= 9223372036854775807n,
      "User ID is too large"
    ),
});


export const updateUserSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),

  email: z.string()
    .trim()
    .email("Please provide a valid email")
    .max(255)
    .transform((value) => value.toLowerCase())
    .optional(),

  role: z.enum(["admin", "customer"]).optional(),

  is_active: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  }
);