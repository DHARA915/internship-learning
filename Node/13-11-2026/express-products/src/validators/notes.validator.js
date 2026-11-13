const { z } = require("zod");

// Create note validation
const createNoteSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Title must contain at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

    content: z.string()
        .trim()
        .min(1, "Content is required")
        .max(5000, "Content cannot exceed 5000 characters"),

    category: z.string()
        .trim()
        .min(2, "Category must contain at least 2 characters")
        .max(50, "Category cannot exceed 50 characters"),

    isArchived: z.boolean().optional().default(false)
});

// Update note validation
const updateNoteSchema = z.object({
    title: z.string()
        .trim()
        .min(3)
        .max(100),

    content: z.string()
        .trim()
        .min(1)
        .max(5000),

    category: z.string()
        .trim()
        .min(2)
        .max(50),

    isArchived: z.boolean().optional()
});

module.exports = {
    createNoteSchema,
    updateNoteSchema
};