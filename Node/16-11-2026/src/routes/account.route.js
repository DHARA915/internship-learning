import express from "express";

import {
    transferBalance
} from "../controllers/account.controller.js";

const router = express.Router();

// Transfer balance between accounts
router.post("/transfer", transferBalance);

export default router;