// Task :3 --> Q:3 List all .js files in a directory recursively (nested folders) using fs.readdir with recursive option.


const fs = require("fs/promises");
const path = require("path");

const PROJECT_DIR = __dirname;

async function listJavaScriptFiles() {
    try {
        const entries = await fs.readdir(PROJECT_DIR, {
            recursive: true,
            withFileTypes: true
        });

        const jsFiles = entries.filter((entry) =>
            entry.isFile() &&
            entry.name.toLowerCase().endsWith(".js")
        );

        console.log("\nJavaScript files:");

        jsFiles.forEach((file) => {
            console.log(path.join(file.parentPath, file.name));
        });

        console.log(`\nTotal JS files: ${jsFiles.length}`);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listJavaScriptFiles();
