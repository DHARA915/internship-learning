
import express from "express";
import authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js"

const router = express.Router();

// POST /api/auth/register
router.post("/register", (req, res, next) => {
  authController.register(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
  authController.login(req, res, next);
});

// Refresh Token
router.post("/refresh", (req, res, next) => {
  authController.refresh(req, res, next);
});

// Logout
router.post("/logout", (req, res, next) => {
  authController.logout(req, res, next);
});

router.get("/me", authenticate, (req, res) => {
  authController.getProfile(req, res);
});

export default router;
