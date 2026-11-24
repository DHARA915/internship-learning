import express from "express";

import postController from "../controllers/post.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createPostSchema,
  getPostsQuerySchema,
  updatePostSchema
} from "../validators/post.validator.js";

const router = express.Router();

// Get posts
router.get(
  "/",
  authenticate,
  validate(getPostsQuerySchema, "query"),
  postController.getAllPosts
);

// Get Post By ID
router.get(
  "/:id",
  authenticate,
  postController.getPostById
);

// POST /api/posts
router.post(
  "/",
  authenticate,
  authorize("admin", "author"),
  validate(createPostSchema),
  postController.createPost
);

// POST /api/posts
router.put(
  "/:id",
  authenticate,
  validate(updatePostSchema),
  postController.updatePost
);

// DELETE 
router.delete(
  "/:id",
  authenticate,
  postController.deletePost
);



export default router;