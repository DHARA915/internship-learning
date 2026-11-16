const fs =  require("fs");
const path = require("path");

// Log file location 
const LOG_DIR = path.join(__dirname,"../../logs");
const LOG_FILE = path.join(LOG_DIR,"app.log");

// Available log levels

const LEVELS = ["INFO","WARN","ERROR","DEBUG"];

// Sample messages
const MESSAGES = {
    INFO: [
        "Server started successfully",
        "User logged in",
        "Request processed successfully",
        "Database connection established"
    ],

    WARN: [
        "High memory usage detected",
        "Slow API response",
        "Deprecated API endpoint used"
    ],

    ERROR: [
        "Database connection failed",
        "Payment processing failed",
        "Authentication failed",
        "File not found",
        "Internal server error"
    ],

    DEBUG: [
        "Processing request",
        "Checking user permissions",
        "Validating request payload"
    ]
};

function generateLogs() {

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    // Create writable stream
    const writeStream = fs.createWriteStream(LOG_FILE);

    for (let i = 0; i < 10000; i++) {

        // Select random level
        const level = LEVELS[
            Math.floor(Math.random() * LEVELS.length)
        ];

        // Select random message for that level
        const messages = MESSAGES[level];

        const message = messages[
            Math.floor(Math.random() * messages.length)
        ];

        // Generate timestamp
        const timestamp = new Date(
            Date.UTC(2026, 10, 1, 0, 0, 0) + i * 60000
        ).toISOString();

        // Construct log entry
        const log = `[${timestamp}] [${level}] ${message}\n`;

        // Write entry into file
        if (!writeStream.write(log)) {
            // Stop generating until the stream is ready again
            // We will handle backpressure properly below.
        }
    }

    writeStream.end();

    writeStream.on("finish", () => {
        console.log("10,000 log entries generated successfully!");
        console.log("File:", LOG_FILE);
    });

    writeStream.on("error", (error) => {
        console.error("File generation failed:", error.message);
    });
}

generateLogs();




