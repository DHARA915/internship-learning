// Mnaually test email worker 

import express from "express";
import emailQueue from "../queues/email.queue.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        // Basic validation
        if (!to || !subject || !body) {
            return res.status(400).json({
                success: false,
                message: "to, subject and body are required"
            });
        }

        // Add job to BullMQ
        const job = await emailQueue.add("send-email", {
            to,
            subject,
            body
        },
            {
                // For static delay
                // delay: 1*60*1000

                // exponential backoff in BullMQ
                attempts: 4,
                backoff: {
                    type: "custom"
                }
            }

        );

        return res.status(202).json({
            success: true,
            message: "Email job added to queue",
            jobId: job.id
        });

    } catch (error) {
        console.error("Email queue error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to add email job"
        });
    }
});

export default router;