import { eventBus } from "./events/eventBus.js";
import { registerEventHandlers } from "./events/eventHandlers.js";

// Register all event listeners
registerEventHandlers();

// Emit order.created
eventBus.emit("order.created", {
    id: "ORD101",
    productName: "Wireless Headphones",
    quantity: 2,
    total: 2999
});

// Emit user.registered
eventBus.emit("user.registered", {
    id: "USR101",
    name: "Dhara",
    email: "dhara@example.com"
});

// Emit payment.received
eventBus.emit("payment.received", {
    id: "PAY101",
    orderId: "ORD101",
    amount: 2999
});