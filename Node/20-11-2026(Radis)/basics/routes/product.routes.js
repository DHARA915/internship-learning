import express from "express";
import productController from "../controller/product.controller.js";
import cacheMiddleware from "../middleware/cache.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { productSchema } from "../validators/product.validator.js";

const router = express.Router();

// Get All Products
router.get("/", cacheMiddleware(60),productController.getProducts);

// Get Product By ID
router.get("/:id", cacheMiddleware(60),productController.getProductById);

// Create Product
router.post("/",validate(productSchema), productController.createProduct);

// Update Product
router.put("/:id", productController.updateProduct);

// Delete Product
router.delete("/:id", productController.deleteProduct);

export default router;