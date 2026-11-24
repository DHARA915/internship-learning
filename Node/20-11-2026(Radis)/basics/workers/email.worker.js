import { Worker } from "bullmq";
import queueRedis from "../config/queueRedis.js";

const emailWorker = new Worker(
    "email-queue",

    
    // async (job) => {
    //     console.log("\nEmail processing started at:", new Date().toLocaleTimeString());

    //     const { to, subject, body } = job.data;

    //     console.log("To:", to);
    //     console.log("Subject:", subject);
    //     console.log("Body:", body);

    //     console.log("Email job processed successfully!");

    //     return { success: true };
    // },

    // retry mechanism
    async (job) => {
    console.log(
        `Attempt ${job.attemptsMade + 1} started at:`,
        new Date().toLocaleTimeString()
    );

    const { to, subject, body } = job.data;

    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", body);

    // Simulate email failure
    throw new Error("Email service is temporarily unavailable");
},

    {
        connection: queueRedis,

        settings: {
            backoffStrategy: (attemptsMade) => {
                const delays = [1000, 4000, 16000];

                return delays[attemptsMade - 1] ?? -1;
            }
        }
    }
);

// Runs when a job is completed successfully
emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

// Runs when a job fails
emailWorker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
});

console.log("Email worker is waiting for jobs...");

export default emailWorker;