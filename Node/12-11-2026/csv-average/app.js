// Task:3 Q:14 Read a large CSV file (1000+ lines) line-by-line using readline + createReadStream, calculate column averages

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const INPUT = path.join(__dirname, "students.csv");
const COLUMNS = ["math", "science", "english"];

async function calculateAverages() {
    const stream = fs.createReadStream(INPUT);

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let headers;
    const stats = {
        math: { sum: 0, count: 0 },
        science: { sum: 0, count: 0 },
        english: { sum: 0, count: 0 }
    };

    try {
        for await (const line of rl) {
            if (!line.trim()) continue;

            const values = line.split(",").map(value => value.trim());

            // First row contains column names
            if (!headers) {
                headers = values;

                for (const column of COLUMNS) {
                    if (!headers.includes(column)) {
                        throw new Error(`Missing column: ${column}`);
                    }
                }

                continue;
            }

            // Process student marks
            for (const column of COLUMNS) {
                const index = headers.indexOf(column);
                const value = Number(values[index]);

                if (values[index] === undefined || values[index] === "" || !Number.isFinite(value)) {
                    continue;
                }

                stats[column].sum += value;
                stats[column].count++;
            }
        }

        if (!headers) {
            throw new Error("CSV file is empty or has no header.");
        }

        // Display averages
        console.log("\n========== COLUMN AVERAGES ==========\n");

        for (const column of COLUMNS) {
            const { sum, count } = stats[column];

            if (count === 0) {
                console.log(`${column}: No valid numeric data`);
            } else {
                console.log(`${column}: ${(sum / count).toFixed(2)}`);
                console.log(`Records: ${count}\n`);
            }
        }

        console.log("CSV processing completed successfully!");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        rl.close();
    }
}

calculateAverages();
