
const productService = require("../services/product.service");
const asyncHandler = require("../utils/async-handler");

// GET all products with pagination
// GET products with price filtering, sorting and pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { minPrice, maxPrice, sort } = req.query;

    // Validate pagination
    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1
    ) {
        const error = new Error("Page and limit must be positive integers");
        error.statusCode = 400;
        throw error;
    }

    // Validate price values
    if (
        (minPrice !== undefined && (minPrice.trim() === "" || !Number.isFinite(Number(minPrice)))) ||
        (maxPrice !== undefined && (maxPrice.trim() === "" || !Number.isFinite(Number(maxPrice))))
    ) {
        const error = new Error("minPrice and maxPrice must be valid numbers");
        error.statusCode = 400;
        throw error;
    }

    const min = minPrice !== undefined ? Number(minPrice) : undefined;
    const max = maxPrice !== undefined ? Number(maxPrice) : undefined;

    if (
        (min !== undefined && min < 0) ||
        (max !== undefined && max < 0) ||
        (min !== undefined && max !== undefined && min > max)
    ) {
        const error = new Error("Invalid price range");
        error.statusCode = 400;
        throw error;
    }

    // Validate sorting
    if (sort && !["price:asc", "price:desc"].includes(sort)) {
        const error = new Error("Sort must be price:asc or price:desc");
        error.statusCode = 400;
        throw error;
    }

    const result = productService.getPaginatedProducts(page, limit, {
        minPrice: min,
        maxPrice: max,
        sort
    });

    res.status(200).json({
        success: true,
        data: result
    });
});

// GET product by ID
const getProductById = asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const product = productService.getProductById(id);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;

        throw error;
    }

    res.status(200).json({
        success: true,
        data: product
    });

});

// POST create product
const createProduct = asyncHandler(async (req, res) => {

    const product = productService.createProduct(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });

});

// PUT update product
const updateProduct = asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const product = productService.updateProduct(id, req.body);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;

        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });

});

// DELETE product
const deleteProduct = asyncHandler(async (req, res) => {

    const id = Number(req.params.id);

    const product = productService.deleteProduct(id);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;

        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    });

});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
