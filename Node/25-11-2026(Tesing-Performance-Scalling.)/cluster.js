
import cluster from "node:cluster";
import { availableParallelism } from "node:os";

const numWorkers = availableParallelism();

if (cluster.isPrimary) {
    let shuttingDown = false;

    console.log(`Primary process PID: ${process.pid}`);
    console.log(`Available CPU cores: ${numWorkers}`);

    // Create a worker
    const createWorker = () => {
        const worker = cluster.fork();

        console.log(
            `Worker created | ID: ${worker.id} | PID: ${worker.process.pid}`
        );
    };

    // Create one worker per CPU core
    for (let i = 0; i < numWorkers; i++) {
        createWorker();
    }

    // Restart worker if it exits unexpectedly
    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `Worker exited | ID: ${worker.id} | PID: ${worker.process.pid} | Code: ${code} | Signal: ${signal}`
        );

        if (!shuttingDown) {
            console.log("Starting replacement worker...");
            createWorker();
        }
    });

    // Graceful shutdown
    const shutdown = () => {
        if (shuttingDown) return;

        shuttingDown = true;

        console.log("Primary process shutting down...");

        for (const worker of Object.values(cluster.workers)) {
            worker?.kill("SIGTERM");
        }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

} else {
    // Each worker runs the worker application
    await import("./worker.js");
}
