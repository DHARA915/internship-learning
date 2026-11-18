
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import authorizeOwnerOrAdmin from "../middleware/authorize-owner.middleware.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();


// GET /api/users
// Admin only
router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    userController.getAllUsers
);

// PUT /api/users/:id
// Admin or account owner
router.put(
    "/:id",
    authMiddleware,
    authorizeOwnerOrAdmin,
    userController.updateUser
);


// For testing Role Based Access.
// Only admin and editor
router.get(
    "/admin-data",
    authMiddleware,
    authorize("admin", "editor"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome admin/editor",
            user: req.user
        });
    }
);

// Only admin
router.delete(
    "/admin-only",
    authMiddleware,
    authorize("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin access granted"
        });
    }
);

export default router;
