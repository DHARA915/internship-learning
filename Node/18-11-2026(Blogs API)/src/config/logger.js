import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",

    // Human-readable ISO timestamp
    timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;