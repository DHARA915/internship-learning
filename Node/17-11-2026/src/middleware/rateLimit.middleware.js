import { rateLimit } from "express-rate-limit";

// Global API rate limiter
export const globalLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes

    limit: 100, // Maximum 100 requests per IP

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again after 15 minutes."
    }

});

// Login-specific rate limiter
export const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes

    limit: 5, // Maximum 5 login attempts per IP

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }

});