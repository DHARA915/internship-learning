const fs = require("fs/promises");

const {
    DATA_DIR,
    IMPORT_DIR,
    EXPORT_DIR,
    TASKS_FILE,
    AUDIT_FILE
} = require("../config/paths");

// Initialize directories and files
async function initializeStorage() {

    await Promise.all([
        fs.mkdir(DATA_DIR, { recursive: true }),
        fs.mkdir(IMPORT_DIR, { recursive: true }),
        fs.mkdir(EXPORT_DIR, { recursive: true })
    ]);

    for (const file of [TASKS_FILE, AUDIT_FILE]) {
        try {
            await fs.access(file);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }

            await fs.writeFile(
                file,
                file === TASKS_FILE ? "[]" : "",
                "utf-8"
            );
        }
    }

    console.log("Storage initialized successfully!");
}

// Read tasks
async function readTasks() {

    const data = await fs.readFile(TASKS_FILE, "utf-8");

    return JSON.parse(data);
}

// Write tasks
async function writeTasks(tasks) {

    await fs.writeFile(
        TASKS_FILE,
        JSON.stringify(tasks, null, 4),
        "utf-8"
    );

}

module.exports = {
    initializeStorage,
    readTasks,
    writeTasks
};