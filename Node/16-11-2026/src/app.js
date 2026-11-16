import express from "express";
import userRoutes from "./routes/user.routes.js";
import accountRoutes from './routes/account.route.js'
import productRoutes from './routes/product.route.js'
import healthRoutes from "./routes/health.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();


// middleware 
app.use(express.json());

// test route 
app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"PostgreSQL Practice API is running"
    });
});

app.use("/api/users",userRoutes)

// Register account routes
app.use("/api/accounts", accountRoutes);

// Optimistic locking with version.
app.use("/api/products", productRoutes);

// check health 
app.use("/api/health", healthRoutes);

// Error handling middleware (must be registered last)
app.use(errorMiddleware);

export default app;