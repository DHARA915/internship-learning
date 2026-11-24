import { eventBus } from "../eventBus/events/eventBus.js";
import { writeAuditLog } from "../audit/audit.service.js";

import {
    acquireWebhookLock,
    markWebhookProcessed,
    releaseWebhookLock
} from "../services/webhook.service.js";

export async function receivePaymentWebhook(req, res) {

    // 1. Get the idempotency key
    const idempotencyKey = req.get("Idempotency-Key");

    if (
        !idempotencyKey ||
        idempotencyKey.length > 200
    ) {
        return res.status(400).json({
            success: false,
            message: "A valid Idempotency-Key is required"
        });
    }

    // 2. Validate the payment event
    const { event, data } = req.body;

    if (
        event !== "payment.received" ||
        !data ||
        typeof data !== "object" ||
        Array.isArray(data) ||
        typeof data.id !== "string" ||
        typeof data.orderId !== "string" ||
        typeof data.amount !== "number" ||
        !Number.isFinite(data.amount) ||
        data.amount <= 0 ||
        typeof data.currency !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment webhook payload"
        });
    }

    let lock;

    try {
        // 3. Try to acquire the Redis lock
        lock = await acquireWebhookLock(idempotencyKey);

        // 4. Handle an already processed payment
        if (lock.status === "duplicate") {
            console.log("Duplicate webhook ignored:", idempotencyKey);

            return res.status(200).json({
                success: true,
                message: "Webhook already processed",
                duplicate: true
            });
        }

        // 5. Handle a payment currently being processed
        if (lock.status === "processing") {
            return res
                .set("Retry-After", "2")
                .status(503)
                .json({
                    success: false,
                    message: "Webhook is currently being processed"
                });
        }

        // 6. Process the payment
        const payment = {
            id: data.id,
            orderId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            receivedAt: new Date().toISOString()
        };

        console.log("Processing payment:", payment.id);

        // 7. Write payment information to the audit log
        await writeAuditLog("payment.received", payment);

        // 8. Notify the application's event listeners
        eventBus.emit("payment.received", payment);

        // 9. Mark the webhook as successfully processed
        const marked = await markWebhookProcessed(
            lock.redisKey,
            lock.lockToken
        );

        if (!marked) {
            throw new Error("Could not mark webhook as processed");
        }

        console.log("Payment webhook processed:", payment.id);

        // 10. Return success
        return res.status(200).json({
            success: true,
            message: "Payment webhook processed successfully",
            paymentId: payment.id
        });

    } catch (error) {
        console.error("Payment webhook processing failed:", error);

        // 11. Release the lock so the provider can retry
        if (lock?.status === "acquired") {
            try {
                await releaseWebhookLock(
                    lock.redisKey,
                    lock.lockToken
                );
            } catch (releaseError) {
                console.error(
                    "Failed to release webhook lock:",
                    releaseError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Payment webhook processing failed"
        });
    }
}