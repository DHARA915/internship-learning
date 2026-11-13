
const express = require("express");

const   router = express.Router();

const validate = require("../middleware/validate.middleware");
const { productSchema } = require("../validators/product.validator");
const productController = require("../controllers/product.controller");

console.log("Product routes loaded");

// GET all products
router.get("/", productController.getAllProducts);

// GET product by ID
router.get("/:id", productController.getProductById);

// POST create product
router.post("/",validate(productSchema), productController.createProduct);

// PUT update product
router.put("/:id", productController.updateProduct);

// DELETE product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
