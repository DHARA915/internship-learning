import { z } from "zod";

const passwordSchema = z.string()
    .min(8, "Password must contain at least 8 characters")
    .refine(
        value => Buffer.byteLength(value, "utf8") <= 72,
        "Password must not exceed 72 UTF-8 bytes"
    );

export const registerSchema = z.object({

    name: z.string()
        .trim()
        .min(3, "Name must contain at least 3 characters")
        .max(100),

    email: z.string()
        .trim()
        .email("Invalid email address")
        .transform(value => value.toLowerCase()),

    password: passwordSchema

});

export const loginSchema = z.object({

    email: z.string()
        .trim()
        .email("Invalid email address")
        .transform(value => value.toLowerCase()),

    password: z.string()
        .min(1, "Password is required")
        .refine(
            value => Buffer.byteLength(value, "utf8") <= 72,
            "Invalid password length"
        )

});

export const refreshTokenSchema = z.object({

    refreshToken: z.string()
        .length(64, "Invalid refresh token")
        .regex(/^[a-f0-9]{64}$/i, "Invalid refresh token")

});