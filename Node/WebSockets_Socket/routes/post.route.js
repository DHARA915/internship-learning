import express from "express";

import {
    createPostController,
    getAllPostsController
} from "../controllers/post.controller.js";

import { authenticateAdmin } from "../middleware/authentication.js";

const router = express.Router();

// Create a post
router.post("/", authenticateAdmin, createPostController);

// Get all posts
router.get("/", authenticateAdmin, getAllPostsController);

export default router;