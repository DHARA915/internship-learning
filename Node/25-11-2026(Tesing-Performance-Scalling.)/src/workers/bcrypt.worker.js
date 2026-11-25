
import { parentPort, workerData } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import bcrypt from "bcrypt";

try {
    // Receive data from main thread
    const { password, saltRounds } = workerData;

    // Start timer
    const startTime = performance.now();

    // Hash password inside worker thread
    const hashedPassword = bcrypt.hashSync(
        password,
        saltRounds
    );

    // Calculate hashing duration
    const duration = performance.now() - startTime;

    // Send result back to main thread
    parentPort.postMessage({
        success: true,
        hashedPassword,
        hashDurationMs: Number(duration.toFixed(2))
    });

} catch (error) {
    // Send error back to main thread
    parentPort.postMessage({
        success: false,
        message: error.message
    });
}
