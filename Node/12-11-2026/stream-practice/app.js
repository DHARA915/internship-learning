// Task:3 Q:9 Copy a large file (>50MB or simulate) using streams (createReadStream -> createWriteStream), log progress percentage


const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");

const SOURCE = path.join(__dirname, "files", "large-file.dat");
const DESTINATION = path.join(__dirname, "output", "large-file.dat");

async function copyLargeFile() {
    try {
        // Get original file size
        const stats = await fs.promises.stat(SOURCE);
        const totalSize = stats.size;

        // Create output directory
        await fs.promises.mkdir(path.dirname(DESTINATION), {
            recursive: true
        });

        // Create streams
        const readStream = fs.createReadStream(SOURCE);
        const writeStream = fs.createWriteStream(DESTINATION);

        let copiedBytes = 0;
        let lastPercentage = -1;

        console.log("Starting file copy...\n");

        // Track progress
        readStream.on("data", (chunk) => {
            copiedBytes += chunk.length;

            const percentage = Math.floor(
                (copiedBytes / totalSize) * 100
            );

            if (percentage !== lastPercentage) {
                process.stdout.write(`\rProgress: ${percentage}%`);
                lastPercentage = percentage;
            }
        });

        // Copy file
        await pipeline(readStream, writeStream);

        console.log("\n\nFile copied successfully!");

        // Verify copied file
        const copiedStats = await fs.promises.stat(DESTINATION);

        console.log("Original size:", totalSize, "bytes");
        console.log("Copied size:", copiedStats.size, "bytes");

    } catch (error) {
        console.error("\nError:", error.message);
        process.exitCode = 1;
    }
}

copyLargeFile();

