import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { orderIdSchema } from "../validators/order.validator.js";

const router = Router();

// ======== CUSTOMER ROUTES ====================================

// Place a new order
router.post(
    "/",
    authenticate,
    authorize("customer"),
    orderController.placeOrder
);

// Get all orders of logged-in customer
router.get(
    "/",
    authenticate,
    authorize("customer"),
    orderController.getMyOrders
);

// Get OrderById
router.get(
    "/:id",
    authenticate,
    authorize("customer"),
    validate(orderIdSchema, "params"),
    orderController.getOrderById
);

// Order cancel
router.patch(
    "/:id/cancel",
    authenticate,
    authorize("customer"),
    validate(orderIdSchema, "params"),
    orderController.cancelMyOrder
);

export default router;