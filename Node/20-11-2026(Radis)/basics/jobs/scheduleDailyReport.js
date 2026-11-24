import reportQueue from "../queues/report.queue.js";
import queueRedis from "../config/queueRedis.js";

const scheduleDailyReport = async () => {
    try {
        const job = await reportQueue.upsertJobScheduler(
            "daily-report-scheduler",
            {
                pattern: "*/1 * * * *",
                tz: "Asia/Kolkata"
            },
            {
                name: "generate-daily-report",
                data: {
                    reportType: "daily"
                }
            }
        );

        console.log("Daily report scheduler registered!");
        console.log("Next job ID:", job?.id);

    } catch (error) {
        console.error("Scheduler error:", error.message);
        process.exitCode = 1;

    } finally {
        await reportQueue.close();
        await queueRedis.quit();
    }
};

scheduleDailyReport();