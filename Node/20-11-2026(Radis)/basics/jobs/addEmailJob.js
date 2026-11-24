import emailQueue from "../queues/email.queue.js";

const addEmailJob = async () => {
    try {
        const job = await emailQueue.add("send-email", {
            to: "user@example.com",
            subject: "Welcome to our application",
            body: "Thank you for registering with us!"
        });

        console.log("Email job added successfully!");
        console.log("Job ID:", job.id);
    } catch (error) {
        console.error("Error adding email job:", error.message);
    } finally {
        await emailQueue.close();
    }
};

addEmailJob();