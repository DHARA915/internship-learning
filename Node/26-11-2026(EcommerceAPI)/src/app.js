import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import pool from "./config/db.js";
import redis from "./config/redis.js";
import errorHandler from "./middleware/error.middleware.js"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js"

const app = express();

// Security middleware
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// HTTP request logging
app.use(pinoHttp());

// Health check API
app.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      postgres: "unknown",
      redis: "unknown",
    },
  };

  try {
    await pool.query("SELECT 1");
    health.services.postgres = "connected";
  } catch (error) {
    health.services.postgres = "disconnected";
    health.status = "error";
  }

  try {
    await redis.ping();
    health.services.redis = "connected";
  } catch (error) {
    health.services.redis = "disconnected";
    health.status = "error";
  }

  const statusCode = health.status === "ok" ? 200 : 503;

  res.status(statusCode).json(health);
});

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Basic welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running",
  });
});

// Error Handling Middleware must be last 
app.use(errorHandler)

export default app;