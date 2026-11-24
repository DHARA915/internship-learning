
import { eventBus } from "./eventBus.js";
import { writeAuditLog } from "../../audit/audit.service.js";
import { sendOrderWebhook } from "../../services/webhookSender.service.js";
import { emailQueue } from "../../queues/email.queue.js";

// Broadcast activity to every authenticated socket
// that has joined the global "activity" room.
function broadcastActivity(io, activity) {
    io.to("activity").emit("activity:new", {
        ...activity,
        timestamp: new Date().toISOString()
    });
}

export function registerEventHandlers(io) {

    // 1. POST CREATED
    eventBus.on("post.created", (data) => {
        console.log("POST CREATED");

        broadcastActivity(io, {
            type: "post.created",
            message: `${data.actor.name} created a post`,
            actor: data.actor,
            post: data.post
        });
    });

    // 2. COMMENT CREATED
    eventBus.on("comment.created", (data) => {
        console.log("COMMENT CREATED");

        broadcastActivity(io, {
            type: "comment.created",
            message: `${data.actor.name} commented on a post`,
            actor: data.actor,
            post: data.post,
            comment: data.comment
        });
    });

    // 3. POST LIKED
    eventBus.on("post.liked", (data) => {
        console.log("POST LIKED");

        broadcastActivity(io, {
            type: "post.liked",
            message: `${data.actor.name} liked a post`,
            actor: data.actor,
            post: data.post
        });
    });

    // 4. ORDER CREATED
    eventBus.on("order.created", async (order) => {
        console.log("ORDER CREATED");
        console.log(`Order ID: ${order.id}`);
        console.log(`Product: ${order.productName}`);

        // Write audit log
        try {
            await writeAuditLog("order.created", order);
        } catch (error) {
            console.error("Failed to write audit log:", error);
        }

        // Add email job to BullMQ
        try {
            if (!process.env.ADMIN_EMAIL) {
                throw new Error("ADMIN_EMAIL is missing in .env");
            }

            const job = await emailQueue.add(
                "send-order-email",
                {
                    to: process.env.ADMIN_EMAIL,
                    order
                },
                {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 2000
                    },
                    removeOnComplete: true
                }
            );

            console.log("Email job added:", job.id);

        } catch (error) {
            console.error("Failed to add email job:", error);
        }

        // Notify admins through Socket.IO
        io.to("admins").emit("notification", {
            type: "order.created",
            message: "A new order has been created",
            order: {
                id: order.id,
                productName: order.productName,
                quantity: order.quantity,
                total: order.total
            },
            timestamp: new Date().toISOString()
        });

        // Send outgoing webhook
        try {
            const result = await sendOrderWebhook(order);

            if (result.success) {
                console.log("Order webhook delivery completed:", result);
            } else {
                console.error("Order webhook delivery failed:", result);
            }

        } catch (error) {
            console.error("Failed to send order webhook:", error);
        }

        console.log("Admin notification sent");
    });

    // 5. USER REGISTERED
    eventBus.on("user.registered", (user) => {
        console.log("USER REGISTERED");
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log("Sending welcome email...");
    });

    // 6. PAYMENT RECEIVED
    eventBus.on("payment.received", (payment) => {
        console.log("PAYMENT RECEIVED");
        console.log(`Payment ID: ${payment.id}`);
        console.log(`Amount: ₹${payment.amount}`);
        console.log("Generating payment receipt...");
    });

    console.log("Application event handlers registered");
}
