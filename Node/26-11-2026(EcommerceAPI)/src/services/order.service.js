import { randomUUID } from "node:crypto";
import orderRepository from "../repositories/order.repository.js";

class OrderService {

    //=============================For customer  =============================================================================================

    async placeOrder(userId) {

        return orderRepository.executeTransaction(async (client) => {

            // 1. Fetch customer's cart items and lock products
            const cartItems = await orderRepository.findCartItemsForOrder(
                client,
                userId
            );

            // 2. Check whether cart is empty
            if (cartItems.length === 0) {
                const error = new Error("Your cart is empty");
                error.statusCode = 400;
                throw error;
            }

            // 3. Validate product availability and stock
            for (const item of cartItems) {

                if (!item.is_active) {
                    const error = new Error(
                        `Product "${item.product_name}" is no longer available`
                    );
                    error.statusCode = 409;
                    throw error;
                }

                if (Number(item.quantity) > Number(item.stock)) {
                    const error = new Error(
                        `Insufficient stock for "${item.product_name}"`
                    );
                    error.statusCode = 409;
                    throw error;
                }
            }

            // 4. Calculate subtotal using integer cents
            const subtotalInCents = cartItems.reduce((total, item) => {

                const priceInCents = Math.round(
                    Number(item.unit_price) * 100
                );

                return total + (
                    priceInCents * Number(item.quantity)
                );

            }, 0);

            const subtotal = (subtotalInCents / 100).toFixed(2);

            // No shipping charges, taxes, or discounts yet
            const totalAmount = subtotal;

            // 5. Generate unique order number
            const orderNumber = `ORD-${Date.now()}-${randomUUID()
                .slice(0, 8)
                .toUpperCase()}`;

            // 6. Create order record
            const order = await orderRepository.createOrder(client, {
                userId,
                orderNumber,
                subtotal,
                totalAmount
            });

            // 7. Insert all purchased products into order_items
            const orderItems = await orderRepository.createOrderItems(
                client,
                order.id,
                cartItems
            );

            // 8. Deduct stock for every purchased product
            for (const item of cartItems) {

                const updatedProduct = await orderRepository.decreaseProductStock(
                    client,
                    item.product_id,
                    item.quantity
                );

                if (!updatedProduct) {
                    const error = new Error(
                        `Unable to update stock for "${item.product_name}"`
                    );
                    error.statusCode = 409;
                    throw error;
                }
            }

            // 9. Clear customer's cart items
            await orderRepository.clearCartItems(client, userId);

            // 10. Return order details
            return {
                order,
                items: orderItems
            };

        });
    }

    // Get all orders placed by a customer
    async getMyOrders(userId) {
        const orders = await orderRepository.findOrdersByUserId(userId);

        return orders;
    }

    // Get Order By Id
    async getOrderById(orderId, userId) {
        const order = await orderRepository.findOrderByIdAndUserId(
            orderId,
            userId
        );

        if (!order) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        return order;
    }

    async cancelMyOrder(orderId, userId) {
        return orderRepository.executeTransaction(async (client) => {
            // 1. Find and lock the customer's order
            const order = await orderRepository.findOrderForCancellation(
                client,
                orderId,
                userId
            );

            if (!order) {
                const error = new Error("Order not found");
                error.statusCode = 404;
                throw error;
            }

            // 2. Check whether the order can be cancelled
            if (!["pending", "confirmed"].includes(order.status)) {
                const error = new Error(
                    `Order cannot be cancelled because its status is "${order.status}"`
                );
                error.statusCode = 409;
                throw error;
            }

            // 3. Get all products and quantities in this order
            const orderItems = await orderRepository.findOrderItemsForCancellation(
                client,
                orderId
            );

            // 4. Restore stock for each product
            for (const item of orderItems) {
                const restoredProduct = await orderRepository.restoreProductStock(
                    client,
                    item.product_id,
                    item.quantity
                );

                if (!restoredProduct) {
                    const error = new Error(
                        `Unable to restore stock for product ${item.product_id}`
                    );
                    error.statusCode = 409;
                    throw error;
                }
            }

            // 5. Update order status
            const cancelledOrder = await orderRepository.cancelOrder(
                client,
                orderId
            );

            return cancelledOrder;
        });
    }

}

export default new OrderService();