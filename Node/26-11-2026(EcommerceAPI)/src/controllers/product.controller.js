
import productService from "../services/product.service.js";

class ProductController {

    async createProduct(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: {
                    product,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const query = res.locals.validated.query;

            const result = await productService.getAllProducts(query);

            return res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = res.locals.validated.params;
            const productData = req.body;

            const product = await productService.updateProduct(
                id,
                productData
            );

            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: {
                    product,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = res.locals.validated.params;

            const product = await productService.getProductById(id, req.user);
            return res.status(200).json({
                success: true,
                message: "Product fetched successfully",
                data: {
                    product,
                },
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ProductController();
