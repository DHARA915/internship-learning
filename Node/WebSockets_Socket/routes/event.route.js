import express from "express";
import { streamEvents } from "../controllers/event.controller.js";

const router = express.Router();

router.get("/stream",streamEvents);

export default router;