import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {

    try {
        const result = await pool.query("SELECT NOW()");

        console.log("PostgreSQL connected successfully!", result);
        console.log("Database time:", result.rows[0].now);

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error.message);

        await pool.end();
        process.exit(1);
    }

}

startServer()