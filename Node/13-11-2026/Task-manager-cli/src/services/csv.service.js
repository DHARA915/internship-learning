const fs = require("fs");
const path = require("path");

const { Readable,Writable } = require("stream");
const { pipeline } = require("stream/promises");

const { stringify } = require("csv-stringify");

const { EXPORT_DIR } = require("../config/paths");

const {
    readTasks,
    writeTasks
} = require("../repositories/task.repository");

const { parse } = require("csv-parse");
const { IMPORT_DIR } = require("../config/paths");

const {
    validateTaskInput
} = require("../utils/validators");

// Export tasks to CSV
async function exportCSV() {

    // Step 1: Read tasks from JSON file
    const tasks = await readTasks();

    // Step 2: Define CSV columns
    const columns = [
        "id",
        "title",
        "description",
        "priority",
        "status",
        "createdAt",
        "completedAt"
    ];

    // Step 3: Generate file path
    const fileName = `tasks-${Date.now()}.csv`;

    const filePath = path.join(EXPORT_DIR, fileName);

    // Step 4: Convert task array into readable stream
    const source = Readable.from(tasks);

    // Step 5: Convert JavaScript objects into CSV
    const csvStream = stringify({
        header: true,
        columns
    });

    // Step 6: Create writable stream
    const destination = fs.createWriteStream(filePath);

    // Step 7: Connect all streams
    await pipeline(
        source,
        csvStream,
        destination
    );

    return filePath;
}

// Import tasks from CSV
async function importCSV(fileName) {

    // Step 1: Get CSV file path from imports folder
    const filePath = path.join(IMPORT_DIR, path.basename(fileName));

    // Step 2: Store imported tasks temporarily
    const importedTasks = [];

    // Step 3: Create CSV parser
    const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true
    });

    // Step 4: Create writable stream to process parsed rows
    const writable = new Writable({
        objectMode: true,

        write(row, encoding, callback) {
            try {
                // Check required CSV columns
                const requiredColumns = [
                    "title",
                    "description",
                    "priority"
                ];

                for (const column of requiredColumns) {
                    if (!(column in row)) {
                        throw new Error(
                            `CSV is missing required column: ${column}`
                        );
                    }
                }

                // Validate task data
                const data = validateTaskInput({
                    title: row.title,
                    description: row.description,
                    priority: row.priority
                });

                importedTasks.push(data);

                callback();

            } catch (error) {
                callback(error);
            }
        }
    });

    // Step 5: Read CSV and process rows
    await pipeline(
        fs.createReadStream(filePath),
        parser,
        writable
    );

    // Step 6: Read existing tasks
    const tasks = await readTasks();

    // Step 7: Generate IDs and prepare imported tasks
    const maxId = tasks.length
        ? Math.max(...tasks.map(task => task.id))
        : 0;

    const newTasks = importedTasks.map((task, index) => ({
        id: maxId + index + 1,
        ...task,
        status: "pending",
        createdAt: new Date().toISOString(),
        completedAt: null
    }));

    // Step 8: Add imported tasks to existing tasks
    tasks.push(...newTasks);

    // Step 9: Save updated tasks
    await writeTasks(tasks);

    return newTasks.length;
}

// Export function
module.exports = {
    exportCSV,
    importCSV
};