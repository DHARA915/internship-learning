
import express from "express";

import {
    checkDatabaseHealth
} from "../controllers/health.controller.js";

const router = express.Router();

router.get("/db", checkDatabaseHealth);

export default router;
