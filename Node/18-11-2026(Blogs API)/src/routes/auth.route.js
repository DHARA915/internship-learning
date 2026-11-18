
import express from "express";

import authController from "../controllers/auth.controller.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

// POST /api/auth/refresh
router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authController.refresh
);

// Logout
router.post(
  "/logout",
  validate(refreshTokenSchema),
  authController.logout
);


router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);


router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
