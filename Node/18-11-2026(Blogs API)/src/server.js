
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verify database connection
        const result = await pool.query("SELECT NOW()");
        
        console.log("PostgreSQL connected successfully!");
        console.log("Database time:", result.rows[0].now);
        
        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        
        // Graceful shutdown
        const shutdown = async () => {
            console.log("Shutting down server...");

            server.close(async () => {
                await pool.end();
                console.log("Database pool closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Server startup failed:", error.message);

        await pool.end();
        process.exit(1);
    }
};

startServer();
