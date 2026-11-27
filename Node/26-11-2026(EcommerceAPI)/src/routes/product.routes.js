import express from "express";

import productController from "../controllers/product.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createProductSchema , getProductsQuerySchema , updateProductSchema } from "../validators/product.validator.js";
import { categoryIdSchema } from "../validators/category.validator.js";

const router = express.Router();

// Create Product (Admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  productController.createProduct
);

// Get All Active Products (Public)
router.get(
    "/",
    validate(getProductsQuerySchema, "query"),
    productController.getAllProducts
);

// Update product 
router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(categoryIdSchema, "params"),
    validate(updateProductSchema),
    productController.updateProduct
);

// Get Product By Id
router.get(
    "/:id",
    authenticate,
    validate(categoryIdSchema, "params"),
    productController.getProductById
);

export default router;
