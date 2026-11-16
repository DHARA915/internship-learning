import express from "express";

import { updateProduct , getProductsWithDetails } from "../controllers/product.controller.js";

const router = express.Router();

router.put("/:id", updateProduct);
router.get("/",getProductsWithDetails)

export default router