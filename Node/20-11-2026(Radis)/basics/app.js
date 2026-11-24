import express from "express";
import productRoutes from './routes/product.routes.js'
import sessionMiddleware from "./middleware/session.middleware.js";
import rateLimiter from "./middleware/rateLimiter.middleware.js";
import sessionRoute from "./routes/session.routes.js";
import emailRoute from "./routes/email.route.js"

const app = express();

const PORT = process.env.PORT || 3000;

// Disable Express automatic ETag generation
app.disable("etag");

// Built-in middleware
app.use(express.json());

// sessionMidlleware
app.use(sessionMiddleware);

// ratelimiter per ip
app.use(rateLimiter)

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.use("/api/products", productRoutes);
app.use("/api/session",sessionRoute);
app.use("/api/emails",emailRoute)

export default app;
