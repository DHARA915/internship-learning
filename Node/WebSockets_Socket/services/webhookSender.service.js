
import "dotenv/config";
import { createHmac, randomUUID } from "node:crypto";

// Maximum number of delivery attempts
const MAX_ATTEMPTS = 3;

// Initial retry delay: 1 second
const INITIAL_DELAY = 1000;

// Read configuration
const WEBHOOK_URL = process.env.OUTGOING_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.OUTGOING_WEBHOOK_SECRET;

// Helper function for waiting
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Send an order-created webhook
export async function sendOrderWebhook(order) {

    if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
        throw new Error("Outgoing webhook configuration is missing");
    }

    // Create the event payload
    const payload = {
        id: randomUUID(),
        event: "order.created",
        data: order,
        timestamp: new Date().toISOString()
    };

    // Convert payload into a JSON string
    const rawBody = JSON.stringify(payload);

    // Generate HMAC signature
    const signature = createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

    // Try delivery up to MAX_ATTEMPTS times
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

        try {
            console.log(
                `Webhook delivery attempt ${attempt}/${MAX_ATTEMPTS}`
            );

            const response = await fetch(WEBHOOK_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-Webhook-Signature": `sha256=${signature}`,
                    "X-Webhook-Event": "order.created",
                    "Idempotency-Key": payload.id
                },

                body: rawBody,

                signal: AbortSignal.timeout(5000)
            });

            // Treat non-2xx responses as delivery failures
            if (!response.ok) {
                throw new Error(
                    `Webhook receiver returned HTTP ${response.status}`
                );
            }

            console.log("Webhook delivered successfully");

            return {
                success: true,
                attempts: attempt,
                eventId: payload.id
            };

        } catch (error) {

            console.error(
                `Webhook attempt ${attempt} failed:`,
                error.message
            );

            // Stop if this was the final attempt
            if (attempt === MAX_ATTEMPTS) {
                console.error("Webhook delivery failed after all attempts");

                return {
                    success: false,
                    attempts: attempt,
                    eventId: payload.id,
                    error: error.message
                };
            }

            // Calculate exponential backoff
            const delay = INITIAL_DELAY * (2 ** (attempt - 1));

            console.log(`Retrying webhook in ${delay / 1000} seconds`);

            await sleep(delay);
        }
    }
}
