const express = require("express");

const logger = require("./middleware/logger.middleware");
const requestIdMiddleware = require("./middleware/requestId.middleware");
const notFound = require("./middleware/not-found.middleware");
const errorHandler = require("./middleware/error.middleware");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/users.routes")
const orderRoutes = require("./routes/orders.routes")

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use(logger)

// Register Request-ID middleware
app.use(requestIdMiddleware);

// Register product routes
app.use("/api/products",productRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)

// Handle unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports= app;

