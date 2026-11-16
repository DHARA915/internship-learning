const {
    addTask,
    listTasks,
    completeTask,
    deleteTask,
    searchTasks
} = require("../services/task.service");

const {
    exportCSV,
    importCSV
} = require("../services/csv.service");

const {
    getTaskStats
} = require("../services/stats.service");

async function handleAddTask(rl) {
    const title = await rl.question("Enter task title: ");
    const description = await rl.question("Enter description: ");
    const priority = await rl.question("Enter priority (high/medium/low): ");

    const task = await addTask({
        title,
        description,
        priority
    });

    console.log("\nTask added successfully!");
    console.log(task);
}

async function handleListTasks() {
    const tasks = await listTasks();

    if (tasks.length === 0) {
        console.log("\nNo tasks found.");
        return;
    }

    console.table(tasks);
}

async function handleCompleteTask(rl) {
    const id = await rl.question("Enter task ID to complete: ");

    const task = await completeTask(id);

    console.log("\nTask completed successfully!");
    console.log(task);
}

async function handleDeleteTask(rl) {
    const id = await rl.question("Enter task ID to delete: ");

    await deleteTask(id);

    console.log("\nTask deleted successfully!");
}

async function handleSearchTasks(rl) {
    const keyword = await rl.question("Enter search keyword: ");

    const tasks = await searchTasks(keyword);

    if (tasks.length === 0) {
        console.log("\nNo matching tasks found.");
        return;
    }

    console.table(tasks);
}

async function handleExportCSV() {
    const filePath = await exportCSV();

    console.log("\nCSV exported successfully!");
    console.log("File location:", filePath);
}

async function handleImportCSV(rl) {
    const fileName = await rl.question("Enter CSV filename from imports folder: ");

    const count = await importCSV(fileName);

    console.log(`\n${count} tasks imported successfully!`);
}

async function handleStats() {
    const stats = await getTaskStats();

    console.log("\n========== TASK STATISTICS ==========\n");
    console.log("Total Tasks:", stats.totalTasks);
    console.log("Completed Tasks:", stats.completedTasks);
    console.log("Pending Tasks:", stats.pendingTasks);
    console.log("Completion Rate:", `${stats.completionRate}%`);
    console.log(
        "Average Completion Time:",
        `${stats.averageCompletionTimeHours} hours`
    );
    console.log("\n=====================================");
}

module.exports = {
    handleAddTask,
    handleListTasks,
    handleCompleteTask,
    handleDeleteTask,
    handleSearchTasks,
    handleExportCSV,
    handleImportCSV,
    handleStats
};