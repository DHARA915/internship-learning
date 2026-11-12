// task:3 --> Q:4 :Watch a directory for changes (fs.watch), log file added/modified/deleted events


const fs = require("fs");
const path = require("path");

const WATCH_DIR = path.join(__dirname, "files");

function watchDirectory() {
    try {
        if (!fs.existsSync(WATCH_DIR)) {
            throw new Error("Directory does not exist!");
        }

        console.log(`Watching directory: ${WATCH_DIR}`);
        console.log("Waiting for file changes...\n");

        const watcher = fs.watch(
            WATCH_DIR,
            { encoding: "utf8" },
            (eventType, filename) => {

                if (!filename) {
                    console.log("Change detected, but filename is unavailable.");
                    return;
                }

                const filePath = path.join(WATCH_DIR, filename);

                if (eventType === "rename") {
                    // rename event can indicate add, delete or rename
                    if (fs.existsSync(filePath)) {
                        console.log(`File added or renamed: ${filename}`);
                    } else {
                        console.log(`File deleted or renamed: ${filename}`);
                    }
                }

                if (eventType === "change") {
                    console.log(`File modified: ${filename}`);
                }
            }
        );

        watcher.on("error", (error) => {
            console.error("Watcher error:", error.message);
        });

        process.on("SIGINT", () => {
            console.log("\nStopping directory watcher...");
            watcher.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("Error:", error.message);
        process.exitCode = 1;
    }
}

watchDirectory();
