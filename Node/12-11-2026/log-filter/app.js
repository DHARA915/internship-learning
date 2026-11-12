
const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

const INPUT = path.join(__dirname, "input.log");
const OUTPUT = path.join(__dirname, "output.log");

class LogFilter extends Transform {
    constructor() {
        super();
        this.remaining = "";
    }

    // Process incoming chunks
    _transform(chunk, encoding, callback) {
        try {
            this.remaining += chunk.toString();

            const lines = this.remaining.split(/\r?\n/);

            // Save incomplete last line
            this.remaining = lines.pop();

            for (const line of lines) {
                this.filterLine(line);
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }

    // Filter ERROR and WARN lines
    filterLine(line) {
        if (line.includes("ERROR") || line.includes("WARN")) {
            this.push(line + "\n");
        }
    }

    // Process remaining data
    _flush(callback) {
        try {
            if (this.remaining) {
                this.filterLine(this.remaining);
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }
}

async function filterLogs() {
    try {
        await pipeline(
            fs.createReadStream(INPUT),
            new LogFilter(),
            fs.createWriteStream(OUTPUT)
        );

        console.log("Logs filtered successfully!");
        console.log("Output:", OUTPUT);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

filterLogs();
