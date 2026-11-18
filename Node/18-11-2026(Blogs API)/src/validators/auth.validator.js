
import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .max(255, "Email cannot exceed 255 characters")
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(72, "Password cannot exceed 72 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
}).strict();


export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .max(255)
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required")
        .max(72, "Password cannot exceed 72 characters")
}).strict();


export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .length(128, "Invalid refresh token format")
        .regex(
            /^[a-fA-F0-9]{128}$/,
            "Invalid refresh token format"
        )
}).strict();

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255)
    .transform((value) => value.toLowerCase())
}).strict();

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .length(64, "Invalid reset token")
    .regex(/^[a-fA-F0-9]{64}$/, "Invalid reset token"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
}).strict();
