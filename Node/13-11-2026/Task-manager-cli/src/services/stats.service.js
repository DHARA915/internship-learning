const { readTasks } = require("../repositories/task.repository");

async function getTaskStats() {

    // Step 1: Read all tasks
    const tasks = await readTasks();

    // Step 2: Calculate total tasks
    const totalTasks = tasks.length;

    // Step 3: Separate completed and pending tasks
    const completedTasks = tasks.filter(
        task => task.status === "completed"
    );

    const pendingTasks = tasks.filter(
        task => task.status === "pending"
    );

    // Step 4: Calculate completion rate
    const completionRate = totalTasks === 0
        ? 0
        : (completedTasks.length / totalTasks) * 100;

    // Step 5: Calculate average completion time
    let totalCompletionTime = 0;
    let validCompletedTasks = 0;

    for (const task of completedTasks) {

        const createdAt = new Date(task.createdAt);
        const completedAt = new Date(task.completedAt);

        const duration = completedAt - createdAt;

        if (
            !Number.isNaN(duration) &&
            duration >= 0
        ) {
            totalCompletionTime += duration;
            validCompletedTasks++;
        }
    }

    const averageCompletionTime = validCompletedTasks === 0
        ? 0
        : totalCompletionTime / validCompletedTasks / (1000 * 60 * 60);

    // Step 6: Return statistics
    return {
        totalTasks,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        completionRate: Number(completionRate.toFixed(2)),
        averageCompletionTimeHours: Number(
            averageCompletionTime.toFixed(2)
        )
    };
}

module.exports = {
    getTaskStats
};