
import { Router } from "express";

import userController from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { getUsersQuerySchema,userIdSchema , updateUserSchema } from "../validators/user.validator.js";

const router = Router();

// GET /api/users?page=1&limit=10
// Admin only
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validate(getUsersQuerySchema, "query"),
  userController.getAllUsers
);

// GET /api/users/:id
// Admin only
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(userIdSchema, "params"),
  userController.getUserById
);

// PATCH /api/users/:id
// Admin only
router.patch(
  "/:id",
  authenticate,
  validate(userIdSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser
);

export default router;
