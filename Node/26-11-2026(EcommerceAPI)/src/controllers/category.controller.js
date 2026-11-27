
import categoryService from "../services/category.service.js";

class CategoryController {
    // POST /api/categories
    async createCategory(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: { category },
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/categories
    async getAllCategories(req, res, next) {
        try {
            const { page, limit, is_active } =
                res.locals.validated.query;

            const result = await categoryService.getAllCategories(
                { page, limit, is_active },
                req.user
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/categories/:id
    async getCategoryById(req, res, next) {
        try {
            const { id } = res.locals.validated.params;

            const category = await categoryService.getCategoryById(
                id,
                req.user
            );

            res.status(200).json({
                success: true,
                data: { category },
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/categories/:id
    async updateCategory(req, res, next) {
        try {
            const { id } = res.locals.validated.params;

            const category = await categoryService.updateCategory(
                id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: { category },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
