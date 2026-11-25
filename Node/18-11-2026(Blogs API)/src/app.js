
import express from "express";
import helmet from "helmet";
import cors from "cors";

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.routes.js"
import postRoutes from "../src/routes/post.route.js"
import healthRoutes from "./routes/health.route.js"
import loggerMiddleware from "./middleware/logger.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// Parse incoming JSON
app.use(express.json());

// Pino HTTP middleware
app.use(loggerMiddleware);

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Blog Platform API is running"
    });
});

// Auth Route
app.use("/api/auth",authRoute)

// User Route
app.use("/api/users", userRoute)

// Post Route
app.use("/api/posts",postRoutes)


export default app;
