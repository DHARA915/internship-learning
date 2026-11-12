
const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const zlib = require("zlib");

// File paths
const INPUT = path.join(__dirname, "input.txt");
const OUTPUT = path.join(__dirname, "output.txt.gz");

// Custom Transform stream
class UppercaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        try {
            const result = chunk.toString().toUpperCase();

            callback(null, result);
        } catch (error) {
            callback(error);
        }
    }
}

// Read -> Uppercase -> Compress -> Write
async function compressFile() {
    try {
        await pipeline(
            fs.createReadStream(INPUT),
            new UppercaseTransform(),
            zlib.createGzip(),
            fs.createWriteStream(OUTPUT)
        );

        console.log("File converted to uppercase and compressed successfully!");
        console.log("Output:", OUTPUT);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

compressFile();
