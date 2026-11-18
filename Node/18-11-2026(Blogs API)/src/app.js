
import express from "express";
import helmet from "helmet";
import cors from "cors";

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.routes.js"

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

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Blog Platform API is running"
    });
});

app.use("/api/auth",authRoute)

app.use("/api/users", userRoute)


export default app;
