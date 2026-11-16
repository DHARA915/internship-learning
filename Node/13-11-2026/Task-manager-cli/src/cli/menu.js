const readline = require("readline/promises");
const { stdin, stdout } = require("process");

const {
    handleAddTask,
    handleListTasks,
    handleCompleteTask,
    handleDeleteTask,
    handleSearchTasks,
    handleExportCSV,
    handleImportCSV,
    handleStats
} = require("./handlers");

// Display menu
function displayMenu() {
    console.log("\n========== TASK MANAGER ==========");
    console.log("1. Add Task");
    console.log("2. List Tasks");
    console.log("3. Complete Task");
    console.log("4. Delete Task");
    console.log("5. Search Tasks");
    console.log("6. Export Tasks to CSV");
    console.log("7. Import Tasks from CSV");
    console.log("8. Show Task Statistics");
    console.log("9. Exit");
    console.log("==================================");
}

// Start interactive menu
async function startMenu() {

    const rl = readline.createInterface({
        input: stdin,
        output: stdout
    });

    try {
        let isRunning = true;

        while (isRunning) {

            displayMenu();

            const choice = await rl.question("Enter your choice: ");

            try {
                switch (choice.trim()) {

                    case "1":
                        await handleAddTask(rl);
                        break;

                    case "2":
                        await handleListTasks();
                        break;

                    case "3":
                        await handleCompleteTask(rl);
                        break;

                    case "4":
                        await handleDeleteTask(rl);
                        break;

                    case "5":
                        await handleSearchTasks(rl);
                        break;

                    case "6":
                        await handleExportCSV();
                        break;

                    case "7":
                        await handleImportCSV(rl);
                        break;

                    case "8":
                        await handleStats();
                        break;

                    case "9":
                        isRunning = false;
                        console.log("\nThank you for using Task Manager!");
                        break;

                    default:
                        console.log("\nInvalid choice. Please select 1-9.");
                }

            } catch (error) {
                console.error("\nError:", error.message);
            }
        }

    } finally {
        rl.close();
    }
}

module.exports = {
    startMenu
};