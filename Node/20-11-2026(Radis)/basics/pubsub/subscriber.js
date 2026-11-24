import redis from "../config/redis.js";

// Create a dedicated Redis connection for subscribing.
const subscriber = redis.duplicate();

const startSubscriber = async () => {
    try {
        await subscriber.subscribe("order:created");

        console.log("Subscribed to order:created channel");
        console.log("Waiting for order events...\n");

    } catch (error) {
        console.error("Subscription error:", error.message);
    }
};

// Listen for messages published to the channel
subscriber.on("message", (channel, message) => {
    console.log("\nReceived event!");
    console.log("Channel:", channel);
    console.log("Message:", message);
});

subscriber.on("error", (error) => {
    console.error("Subscriber Redis error:", error.message);
});

startSubscriber();
