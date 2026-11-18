import express from "express";

import userController from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { userListQuerySchema,updateUserSchema } from "../validators/user.validator.js";
import validate from "../middleware/validate.middleware.js";
import authorizeUser from "../middleware/authorize-user.middleware.js";

const router = express.Router();


// GetAllUser - Only admin can access
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validate(userListQuerySchema, "query"),
  userController.getAllUsers
);

// GET /api/users/:id
router.get(
  "/:id",
  authenticate,
  authorizeUser,
  userController.getUserById
);

// GET /api/users/profile
router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

// PUT /api/users/:id
router.put(
  "/:id",
  authenticate,
    authorizeUser,
  validate(updateUserSchema),
  userController.updateUser
);

// DELETE /api/users/:id -Only Admin can delete
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser
);

// Temporary admin-only test
router.get(
  "/admin-test",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin!",
      user: req.user
    });
  }
);

export default router;