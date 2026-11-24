
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const logDirectory = path.resolve("logs");
const logFile = path.join(logDirectory, "audit.log");

export async function writeAuditLog(event, data) {
    await mkdir(logDirectory, { recursive: true });

    const entry = {
        event,
        data,
        timestamp: new Date().toISOString()
    };

    await appendFile(
        logFile,
        `${JSON.stringify(entry)}\n`,
        "utf8"
    );

    console.log("Audit log created:", event);
}
