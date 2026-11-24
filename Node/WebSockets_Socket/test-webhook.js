
import "dotenv/config";
import { createHmac } from "node:crypto";

// 1. Get the webhook secret
const secret = process.env.PAYMENT_WEBHOOK_SECRET;

if (!secret) {
    throw new Error("PAYMENT_WEBHOOK_SECRET is missing in .env");
}

// 2. Create a sample payment event
const payload = {
    event: "payment.received",
    data: {
        id: "PAYMENT_1001",
        orderId: "ORDER_5001",
        amount: 2500,
        currency: "INR"
    }
};

// 3. Convert the payload into a JSON string
const rawBody = JSON.stringify(payload);

// 4. Generate the HMAC signature
const signature = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

// 5. Send the webhook request
const response = await fetch("http://localhost:3000/api/webhooks/payment", {
    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": `sha256=${signature}`,
        "Idempotency-Key": "webhook-event-1001"
    },

    body: rawBody
});

// 6. Display the response
const result = await response.json();

console.log("HTTP Status:", response.status);
console.log("Response:", result);
