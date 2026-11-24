
import redis from "./config/redis.js";

const tasks = {
    "2": () => import("./tasks/Radishash.js"),
    "3": () => import("./tasks/leaderboardSortedSet.js"),
    "4": ()=>  import("./tasks/redisList.js") 
};

async function main() {
    const selectedTask = process.argv[2];

    try {
        if (!tasks[selectedTask]) {
            console.log("\nAvailable Redis Tasks:");
            console.log("2. Redis Hash");
            console.log("3. Redis Leaderboard");
            console.log("4. Redis Lists");
            console.log("\nRun: npm run dev -- <task-number>");
            return;
        }

        console.log(`\nRunning Task ${selectedTask}...\n`);

        const taskModule = await tasks[selectedTask]();

        

        await taskModule.default();

        console.log("\nTask completed successfully!");

    } catch (error) {
        console.error("Error:", error.message);
        process.exitCode = 1;
    } finally {
        await redis.quit();
    }
}

main();
