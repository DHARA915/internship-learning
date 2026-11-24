
import express from "express";
import {
    addOrder,
    listOrders,
    streamOrders
} from "../controllers/order.controller.js";
import { authenticateAdmin } from "../middleware/authentication.js";

const router = express.Router();

router.post("/", addOrder);

router.get("/", authenticateAdmin, listOrders);

router.get("/stream", authenticateAdmin, streamOrders);

export default router;
