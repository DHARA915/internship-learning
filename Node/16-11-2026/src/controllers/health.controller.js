
import pool from "../config/db.js";

export const checkDatabaseHealth = async (req, res) => {

    try {


        // Get connection pool statistics
        const poolStats = {
            total: pool.totalCount,
            idle: pool.idleCount,
            waiting: pool.waitingCount
        };

        return res.status(200).json({
            success: true,
            status: "healthy",
            database: "PostgreSQL",
            connection: "connected",
            pool: poolStats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {

        return res.status(503).json({
            success: false,
            status: "unhealthy",
            database: "PostgreSQL",
            connection: "disconnected",
            error: error.message,
            pool: {
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount
            },
            timestamp: new Date().toISOString()
        });

    }
};
