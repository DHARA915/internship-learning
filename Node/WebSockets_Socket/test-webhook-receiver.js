
import "dotenv/config";
import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

const app = express();
const PORT = 4000;

app.use(express.json({
    verify: (req, res, buffer) => {
        req.rawBody = Buffer.from(buffer);
    }
}));

app.post("/webhook", (req, res) => {
    try {
        // 1. Get the signature sent by the webhook sender
        const signature = req.get("X-Webhook-Signature");

        if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Webhook signature missing"
            });
        }

        // 2. Generate the expected signature
        const expectedSignature = createHmac(
            "sha256",
            process.env.OUTGOING_WEBHOOK_SECRET
        )
            .update(req.rawBody)
            .digest("hex");

        // 3. Extract the received signature
        const receivedSignature = signature.startsWith("sha256=")
            ? signature.slice(7)
            : signature;

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(receivedSignature, "hex");

        // 4. Verify the signature
        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        // 5. Display the received event
        console.log("\nWEBHOOK RECEIVED");
        console.log("Event:", req.body.event);
        console.log("Event ID:", req.body.id);
        console.log("Order:", req.body.data);

        return res.status(200).json({
            success: true,
            message: "Webhook received successfully"
        });

    } catch (error) {
        console.error("Receiver error:", error);

        return res.status(500).json({
            success: false,
            message: "Webhook receiver error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Test webhook receiver running on port ${PORT}`);
});
