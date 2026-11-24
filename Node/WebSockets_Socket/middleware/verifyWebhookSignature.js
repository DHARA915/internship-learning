
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWebhookSignature(req, res, next) {
    try {
        // 1. Get the shared secret
        const secret = process.env.PAYMENT_WEBHOOK_SECRET;

        if (!secret) {
            console.error("PAYMENT_WEBHOOK_SECRET is missing");

            return res.status(500).json({
                success: false,
                message: "Webhook configuration error"
            });
        }

        // 2. Get the signature from request headers
        const signature = req.headers["x-webhook-signature"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Webhook signature is missing"
            });
        }

        // 3. Check whether raw body is available
        if (!req.rawBody) {
            return res.status(400).json({
                success: false,
                message: "Raw request body is missing"
            });
        }

        // 4. Generate our expected HMAC signature
        const expectedSignature = createHmac("sha256", secret)
            .update(req.rawBody)
            .digest("hex");

        // 5. Remove the sha256= prefix from received signature
        const receivedSignature = signature.startsWith("sha256=")
            ? signature.slice(7)
            : signature;

        // 6. Convert signatures into buffers
        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(receivedSignature, "hex");

        // 7. Check lengths before timingSafeEqual
        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        // 8. Signature is valid
        console.log("Webhook signature verified successfully");

        next();

    } catch (error) {
        console.error("Webhook verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Webhook verification failed"
        });
    }
}
