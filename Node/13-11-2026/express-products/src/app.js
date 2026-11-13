const express = require("express");
const corsMiddleware = require("./config/cors");

const logger = require("./middleware/logger.middleware");
const requestIdMiddleware = require("./middleware/requestId.middleware");
const notFound = require("./middleware/not-found.middleware");
const errorHandler = require("./middleware/error.middleware");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/users.routes")
const orderRoutes = require("./routes/orders.routes")
const uploadRoutes = require("./routes/upload.routes");

// notes
const notesRoutes = require("./routes/notes.routes");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(corsMiddleware);

// Request logging middleware
app.use(logger)

// Register Request-ID middleware
app.use(requestIdMiddleware);

// Register product routes
app.use("/api/products",productRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)

// for notes
app.use("/api/notes", notesRoutes);

// Upload routes
app.use("/api/upload", uploadRoutes);

// Handle unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports= app;

