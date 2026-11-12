// Task:3 -->  Q:5 Build file stats reporter: given a directory, report total files, total size, largest file, file type breakdown

const fs = require("fs/promises");
const path = require("path");

const TARGET_DIR = path.join(__dirname, "files");

// formate bytes into readable format

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} Bytes`;

    const units = ["KB", "MB", "GB", "TB"];
    let size = bytes;
    let index = -1;

    do {
        size /= 1024;
        index++;
    } while (size >= 1024 && index < units.length - 1);

    return `${size.toFixed(2)} ${units[index]}`;
}

// Get all files recursively from a directory
async function getAllFiles(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            const nestedFiles = await getAllFiles(fullPath);
            files.push(...nestedFiles);
        } else if (entry.isFile()) {
            files.push(fullPath);
        }
    }
   return files;
}

// Generate file statistics

async function generateReport(directory) {
    try {
        const dirStats = await fs.stat(directory);

        if (!dirStats.isDirectory()) {
            throw new Error("Provided path is not a directory.");
        }

        // Collect all files
        const files = await getAllFiles(directory);

        let totalSize = 0;
        let largestFile = null;

        const fileTypes = {};

        // Analyze every file
        for (const filePath of files) {
            const stats = await fs.stat(filePath);

            const size = stats.size;
            const extension = path.extname(filePath).toLowerCase() || "No extension";

            // Calculate total size
            totalSize += size;

            // Find largest file
            if (largestFile === null || size > largestFile.size) {
                largestFile = {
                    name: path.relative(directory, filePath),
                    size: size
                };
            }

            // Count file types
            fileTypes[extension] = (fileTypes[extension] || 0) + 1;
        }

        // Display report
        console.log("\n========== FILE STATS REPORT ==========\n");

        console.log(`Directory       : ${directory}`);
        console.log(`Total files     : ${files.length}`);
        console.log(`Total size      : ${formatSize(totalSize)}`);

        if (largestFile) {
            console.log("\nLargest File:");
            console.log(`Name            : ${largestFile.name}`);
            console.log(`Size            : ${formatSize(largestFile.size)}`);
        } else {
            console.log("\nNo files found.");
        }

        console.log("\nFile Type Breakdown:");

        for (const [extension, count] of Object.entries(fileTypes)) {
            console.log(`${extension.padEnd(15)}: ${count} file(s)`);
        }

        console.log("\n=======================================");

    } catch (error) {
        console.error("Report generation failed:", error.message);
        process.exitCode = 1;
    }
}

// Execute
generateReport(TARGET_DIR);