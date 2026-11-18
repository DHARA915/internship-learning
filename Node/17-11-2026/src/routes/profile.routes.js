
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    userController.getProfile
);

export default router;
