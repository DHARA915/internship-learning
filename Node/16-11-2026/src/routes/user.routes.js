import express from "express";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersWithCursor
} from "../controllers/user.controller.js";

const router = express.Router();

// GET all users + filters
router.get("/", getUsers);

// GET paginated user by Cursor pagination

router.get("/cursor",getUsersWithCursor)

// GET user by ID
router.get("/:id", getUserById);

// CREATE user
router.post("/", createUser);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

export default router;