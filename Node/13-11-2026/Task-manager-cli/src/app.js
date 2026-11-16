const {
    initializeStorage
} = require("./repositories/task.repository");

const {
    startMenu
} = require("./cli/menu");

async function startApp() {
    try {
        await initializeStorage();

        console.log("\nWelcome to Task Manager CLI!");

        await startMenu();

    } catch (error) {
        console.error("Application Error:", error.message);
        process.exitCode = 1;
    }
}

startApp();