import productService from "../services/product.service.js";
import generateETag from "../utils/etag.js";

const productController = {

    // Get ProductById
    async getProductById(req, res, next) {

        try {

            // 1. Validate product ID
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            // 2. Fetch product from service
            const product = await productService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            // 3. Generate ETag from response data
            const responseBody = {
                success: true,
                data: product
            };

            const etag = generateETag(responseBody);

            // 4. Set ETag response header
            res.setHeader("ETag", etag);

            // 5. Get client's ETag
            const clientETag = req.get("If-None-Match");

            console.log("Server ETag:", etag);
            console.log("Client ETag:", clientETag);

            // 6. Compare ETags
            if (clientETag) {

                const clientETags = clientETag
                    .split(",")
                    .map(tag => tag.trim());

                const isMatch = clientETags.some(tag => {
                    return tag === "*" ||
                        tag.replace(/^W\//, "") === etag;
                });

                // 7. Return 304 if ETags match
                if (isMatch) {
                    return res.status(304).end();
                }
            }

            // 8. Return full response if ETags don't match
            return res.status(200).json(responseBody);

        } catch (error) {
            next(error);
        }
    },


    // Get All Products
    async getProducts(req, res, next) {
        try {
            const products = await productService.getProducts();

            return res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });

        } catch (error) {
            next(error);
        }
    },

    // Create Product
    async createProduct(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Product
    async updateProduct(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const product = await productService.updateProduct(
                id,
                req.body
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: product
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Product
    async deleteProduct(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const product = await productService.deleteProduct(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                data: product
            });

        } catch (error) {
            next(error);
        }
    }

};

export default productController;