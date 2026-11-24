import {Router} from "express";
import {verifyWebhookSignature} from "../middleware/verifyWebhookSignature.js"
import { receivePaymentWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/payment",verifyWebhookSignature,receivePaymentWebhook)

export default router;