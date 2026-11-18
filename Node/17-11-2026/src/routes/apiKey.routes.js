import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import apiController from "../controllers/apikey.controller.js";

const router = express.Router();

// Generate Api key 
router.post(
    "/",
    authMiddleware,
    apiController.createApiKey
)

export default router