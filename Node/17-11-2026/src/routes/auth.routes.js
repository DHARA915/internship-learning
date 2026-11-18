import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";

import {
    registerSchema,
    loginSchema,
    refreshTokenSchema
} from "../validators/auth.schema.js";

const router = Router();



// Register
router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

// Login
router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

// Refresh Token 
router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authController.refresh
)

// LOGOUT 
router.post(
    "/logout",
    validate(refreshTokenSchema),
    authController.logout
);

export default router;