import orderService from "../services/order.service.js";

class OrderController {

    // ================FOR CUSTOMER======================================================

    // Place a new order
    async placeOrder(req, res, next) {
        try {
            const userId = req.user.id;

            const result = await orderService.placeOrder(userId);

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    // Get all orders of logged-in customer
    async getMyOrders(req, res, next) {
        try {
            const userId = req.user.id;

            const orders = await orderService.getMyOrders(userId);

            return res.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                count: orders.length,
                data: orders
            });

        } catch (error) {
            next(error);
        }
    }

    // Get Order By id
    async getOrderById(req, res, next) {
        try {
            const { id } = res.locals.validated.params;
            const userId = req.user.id;

            const order = await orderService.getOrderById(id, userId);

            return res.status(200).json({
                success: true,
                message: "Order details fetched successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Cancel Order
    async cancelMyOrder(req, res, next) {
        try {
            const { id } = res.locals.validated.params;
            const userId = req.user.id;

            const order = await orderService.cancelMyOrder(id, userId);

            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new OrderController();