import { Queue } from "bullmq";

import queueRedis from "../config/queueRedis.js";

const reportQueue = new Queue("report-queue", {
    connection: queueRedis
});

reportQueue.on("error", (error) => {
    console.error("Report queue error:", error.message);
});

export default reportQueue;