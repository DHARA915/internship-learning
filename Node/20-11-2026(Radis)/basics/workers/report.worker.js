import { Worker } from "bullmq";
import queueRedis from "../config/queueRedis.js";

const reportWorker = new Worker(
    "report-queue",
    async (job) => {
        console.log("\nGenerating daily report...");
        console.log("Job ID:", job.id);
        console.log("Report type:", job.data.reportType);
        console.log("Generated at:", new Date().toLocaleString());

        // Simulate report generation
        console.log("Daily report generated successfully!");

        return {
            success: true,
            reportType: job.data.reportType
        };
    },
    {
        connection: queueRedis
    }
);

reportWorker.on("completed", (job) => {
    console.log(`Report job ${job.id} completed`);
});

reportWorker.on("failed", (job, error) => {
    console.error(`Report job ${job?.id} failed:`, error.message);
});

reportWorker.on("error", (error) => {
    console.error("Report worker error:", error.message);
});

console.log("Report worker is waiting for scheduled jobs...");

export default reportWorker;