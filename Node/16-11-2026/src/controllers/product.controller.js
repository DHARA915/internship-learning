
import ProductRepository from "../repositories/product.repository.js";

export const updateProduct = async (req, res, next) => {

    try {
        const id = Number(req.params.id);

        const {
            name,
            description,
            price,
            stock,
            category_id,
            version
        } = req.body;

        // Validate ID and version
        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            !Number.isSafeInteger(version) ||
            version < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID and version are required"
            });
        }

        // Validate required product fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            !Number.isInteger(category_id) ||
            category_id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data"
            });
        }

        const result = await ProductRepository.updateWithVersion(
            id,
            {
                name: name.trim(),
                description,
                price,
                stock,
                category_id
            },
            version
        );

        if (result.status === "not_found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (result.status === "conflict") {
            return res.status(409).json({
                success: false,
                message: "Product was modified by another user. Please fetch the latest data.",
                currentVersion: result.currentVersion
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: result.product
        });

    } catch (error) {
        next(error);
    }
};


export const getProductsWithDetails = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // Validate pagination
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit"
            });
        }

        const result = await ProductRepository.findProductsWithDetails(
            page,
            limit
        );

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

