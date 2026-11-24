
import { Router } from "express";

const router = Router();

// POST /api/session/login
router.post("/login", (req, res, next) => {
    // Create session data
    req.session.user = {
        id: 10,
        name: "Test User",
        role: "admin"
    };

    // Save session in Redis before responding
    req.session.save((error) => {
        if (error) {
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: req.session.user
        });
    });
});


// GET /api/session/profile
router.get("/profile", (req, res) => {

    // Check whether user has an active session
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    res.status(200).json({
        success: true,
        message: "Session retrieved successfully",
        user: req.session.user
    });
});


// POST /api/session/logout
router.post("/logout", (req, res, next) => {

    // Destroy session from Redis
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        // Remove session cookie from client
        res.clearCookie("connect.sid", {
            path: "/"
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    });
});

export default router;
