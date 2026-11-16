const {
    initializeStorage
} = require("./src/repositories/task.repository");

const {
    getTaskStats
} = require("./src/services/stats.service");

async function testStats() {

    try {
        await initializeStorage();

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

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testStats();