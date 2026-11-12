// Task:3 Q:10 Create a Transform stream that converts CSV data to JSON - pipe input.csv through it to output.jsonCreate a Transform stream that converts CSV data to JSON - pipe input.csv through it to output.json

const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const { parse } = require("csv-parse");

// Input and output file paths
const INPUT = path.join(__dirname, "input.csv");
const OUTPUT = path.join(__dirname, "output.json");

// Custom Transform stream
class CSVToJSON extends Transform {
    constructor() {
        super({
            writableObjectMode: true
        });

        this.isFirstRecord = true;

        // Start JSON array
        this.push("[\n");
    }

    // Process each CSV record
    _transform(record, encoding, callback) {
        try {
            const separator = this.isFirstRecord ? "" : ",\n";

            const json = JSON.stringify(record, null, 2);

            this.push(separator + json);

            this.isFirstRecord = false;

            callback();
        } catch (error) {
            callback(error);
        }
    }

    // Called when all input records are processed
    _flush(callback) {
        this.push("\n]\n");
        callback();
    }
}

// Convert CSV file to JSON
async function convertCSVToJSON() {
    try {
        await pipeline(
            fs.createReadStream(INPUT),

            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            }),

            new CSVToJSON(),

            fs.createWriteStream(OUTPUT)
        );

        console.log("CSV converted to JSON successfully!");
        console.log("Output file:", OUTPUT);

    } catch (error) {
        console.error("Conversion failed:", error.message);
    }
}

convertCSVToJSON();
