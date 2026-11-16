const fs = require("fs");
const readline = require("readline");
const path = require("path");

const parseLog = require("../utils/parseLog");

async function processLogs({ level, from, to }) {

    const LOG_FILE = path.join(__dirname, "../../logs/app.log");

    // Create readable stream
    const readStream = fs.createReadStream(LOG_FILE, {
        encoding: "utf8"
    });

    // Create readline interface
    const lineReader = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let totalLines = 0;
    let matchedLines = 0;

    // Read logs line by line
    for await (const line of lineReader) {

        totalLines++;

        // Parse log
        const log = parseLog(line);

        // Skip invalid logs
        if (!log) {
            continue;
        }

        // Filter by level
        if (level && log.level !== level) {
            continue;
        }

        // Convert timestamp into Date
        const logDate = new Date(log.timestamp);

        // Filter by starting date
        if (from && logDate < from) {
            continue;
        }

        // Filter by ending date
        if (to && logDate > to) {
            continue;
        }

        matchedLines++;

        console.log(log);
    }

    console.log("\n========== FILTER SUMMARY ==========");

    console.log("Total lines:", totalLines);
    console.log("Matched lines:", matchedLines);
}

module.exports = processLogs;