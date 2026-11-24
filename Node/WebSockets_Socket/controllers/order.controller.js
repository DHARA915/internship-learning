
import {
    createOrder,
    getOrders,
    subscribeToOrders
} from "../services/order.service.js";

export function addOrder(req, res) {
    const { productName, quantity, total } = req.body;

    if (
        typeof productName !== "string" ||
        !productName.trim() ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        typeof total !== "number" ||
        !Number.isFinite(total) ||
        total <= 0
    ) {
        return res.status(400).json({
            message: "Invalid order data"
        });
    }

    const order = createOrder({
        productName: productName.trim(),
        quantity,
        total
    });

    return res.status(201).json({
        message: "Order created successfully",
        order
    });
}

export function listOrders(req, res) {
    return res.json({
        orders: getOrders()
    });
}

export function streamOrders(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    res.write("event: connected\n");
    res.write('data: {"message":"Connected to order feed"}\n\n');

    const unsubscribe = subscribeToOrders((order) => {
        res.write("event: new-order\n");
        res.write(`data: ${JSON.stringify(order)}\n\n`);
    });

    const heartbeat = setInterval(() => {
        res.write(": heartbeat\n\n");
    }, 25000);

    req.on("close", () => {
        clearInterval(heartbeat);
        unsubscribe();
        console.log("Admin dashboard disconnected from order feed");
    });
}
