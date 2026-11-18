import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js"
import profileRoute from "./routes/profile.routes.js"

import { loginSchema } from "./validators/auth.schema.js";
import validate from "./middleware/validate.middleware.js";

import authController from "./controllers/auth.controller.js";

import errorMiddleware from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/rateLimit.middleware.js";
import { loginLimiter } from "./middleware/rateLimit.middleware.js";


import sessionMiddleware from "./config/sessions.js";
import apikeyRoute from "./routes/apiKey.routes.js"

const app = express();
const router = express.Router();

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

app.use(helmet());

app.use(sessionMiddleware);

// 3. Configure allowed frontend origins
const allowedOrigins = (
    process.env.CORS_ORIGINS || "http://localhost:5173"
).split(",").map(origin => origin.trim());

app.use(cors({
    origin: (origin, callback) => {

        // Allow requests without an Origin header
        // (e.g. Insomnia or server-to-server requests)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-API-Key"
    ],

    credentials: true,

    optionsSuccessStatus: 204
}));


// Global rate limiter
app.use(globalLimiter);

// Health check
app.get("/api/health", (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Server is running"
    });

});

// Authentication routes
app.use("/api/auth", authRoutes);

// login with rate limit
router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    authController.login
);

// Register routes
app.use("/api/users", userRoutes);

// Profile
app.use("/api/profile",profileRoute)

// Generate Api Key
app.use("/api/keys",apikeyRoute)


// verify  express-sessions
app.get("/api/session-test", (req, res) => {

    // Check whether visitCount exists
    if (!req.session.visitCount) {
        req.session.visitCount = 0;
    }

    // Increase visit count
    req.session.visitCount++;

    return res.status(200).json({
        success: true,
        message: "Session working successfully",
        visitCount: req.session.visitCount
    });
});

// 404 handler
app.use((req, res) => {

    return res.status(404).json({
        success: false,
        message: "Route not found"
    });

});



// Global error handler
app.use(errorMiddleware);

export default app;