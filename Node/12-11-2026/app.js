// Task 3 --> Q:2  Create a directory structure: project/src, project/dist, project/config - handle ‘already exists’ error


const fs = require("fs/promises");
const path = require("path");

const PROJECT_DIR = path.join(__dirname, "project");

const directories = [
    "src",
    "dist",
    "config"
];

async function createProjectStructure() {
    try {
        // Create project root directory
        await fs.mkdir(PROJECT_DIR, { recursive: true });

        // Create all subdirectories
        for (const directory of directories) {
            const directoryPath = path.join(PROJECT_DIR, directory);

            try {
                await fs.mkdir(directoryPath);
                console.log(`Created: ${directory}/`);
            } catch (error) {
                if (error.code === "EEXIST") {
                    console.log(`Already exists: ${directory}/`);
                } else {
                    throw error;
                }
            }
        }

        console.log("Project structure setup completed!");

    } catch (error) {
        console.error("Directory creation failed:", error.message);
        process.exitCode = 1;
    }
}

createProjectStructure();
