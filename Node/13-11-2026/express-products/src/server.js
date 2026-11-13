
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Process ID: ${process.pid}`);
});

// Track shutdown state
let isShuttingDown = false;

// Graceful shutdown function
function gracefulShutdown(signal) {
    if (isShuttingDown) return;

    isShuttingDown = true;

    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections and wait for ongoing requests
    server.close((error) => {
        if (error) {
            console.error("Error during server shutdown:", error);
            process.exitCode = 1;
            return;
        }

        console.log("All requests completed.");
        console.log("HTTP server closed.");

        process.exitCode = 0;
    });
}

// Handle termination signals
process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
    gracefulShutdown("SIGINT");
});
