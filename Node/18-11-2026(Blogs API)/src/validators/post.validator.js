import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must contain at least 5 characters")
    .max(255, "Title cannot exceed 255 characters"),

  content: z
    .string()
    .trim()
    .min(20, "Content must contain at least 20 characters"),

  categoryIds: z
    .array(z.string().uuid("Invalid category ID"))
    .max(10, "A post can have at most 10 categories")
    .optional()
    .default([])
}).strict();

// GET /api/posts query validation
export const getPostsQuerySchema = z.object({
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(50)
    .default(10),

  cursor: z.string().optional(),

  status: z.enum(["draft", "published"]).optional(),

  authorId: z.string().uuid().optional(),

  categoryId: z.string().uuid().optional(),

  search: z.string().trim().min(1).max(100).optional()
}).strict();

// Update Post
export const updatePostSchema = z.object({
  title: z.string().trim().min(5).max(255).optional(),

  content: z.string().trim().min(20).optional(),

  categoryIds: z.array(z.string().uuid()).max(10).optional(),

  version: z.coerce.number().int().min(1)
}).strict().refine(
  (data) =>
    data.title !== undefined ||
    data.content !== undefined ||
    data.categoryIds !== undefined,
  {
    message: "At least one field must be provided for update"
  }
);

