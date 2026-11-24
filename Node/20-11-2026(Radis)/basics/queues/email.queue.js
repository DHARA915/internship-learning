
import { Queue } from "bullmq";

import queueRedis from "../config/queueRedis.js";

// Create email queue
const emailQueue = new Queue("email-queue", {
    connection: queueRedis
});

emailQueue.on("error", (error) => {
    console.error("Email queue error:", error.message);
});

export default emailQueue;
