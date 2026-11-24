import { randomUUID } from "node:crypto";
import { eventBus } from "../eventBus/events/eventBus.js";

const orders = [];
const subscribers = new Set();

export function createOrder(data) {
    const order = {
        id: randomUUID(),
        productName: data.productName,
        quantity: data.quantity,
        total: data.total,
        status: "placed",
        createdAt: new Date().toISOString()
    };

    orders.push(order);

    for (const subscriber of subscribers) {
        subscriber(order);
    }

    // Emit Event Bus event
    eventBus.emit("order.created", order);

    return order;
}

export function getOrders() {
    return orders;
}

export function subscribeToOrders(callback) {
    subscribers.add(callback);

    return () => {
        subscribers.delete(callback);
    };
}
