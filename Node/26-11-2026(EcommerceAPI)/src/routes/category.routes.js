import express from "express";
import categoryController from "../controllers/category.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  optionalAuthenticate,
} from "../middleware/auth.middleware.js";


import {  createCategorySchema,getCategoriesQuerySchema,categoryIdSchema , updateCategorySchema } from "../validators/category.validator.js";


const router = express.Router();

// Create Category
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  categoryController.createCategory
);

// Get All Categories
router.get(
  "/",
  optionalAuthenticate,
  validate(getCategoriesQuerySchema,"query"),
  categoryController.getAllCategories
);

// Get Category By Id
router.get(
  "/:id",
  optionalAuthenticate,
  validate(categoryIdSchema, "params"),
  categoryController.getCategoryById
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

export default router;