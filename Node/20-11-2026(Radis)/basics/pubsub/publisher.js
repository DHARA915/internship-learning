import redis from "../config/redis.js";

const publishOrderCreated = async () => {
    try {
        const order = {
            orderId: 101,
            userId: 25,
            totalAmount: 2499,
            status: "created",
            createdAt: new Date().toISOString()
        };

        // Convert JavaScript object into JSON string
        const message = JSON.stringify(order);

        // Publish message to Redis channel
        const subscribersCount = await redis.publish(
            "order:created",
            message
        );

        console.log("Order event published successfully!");
        console.log("Subscribers receiving message:", subscribersCount);
        console.log("Published order:", order);

    } catch (error) {
        console.error("Publishing error:", error.message);
    }
};

publishOrderCreated();
