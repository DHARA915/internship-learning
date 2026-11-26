import categoryRepository from "../repositories/category.repository.js";

class CategoryService {

    async createCategory(categoryData) {
        // Check whether category already exists
        const existingCategory = await categoryRepository.findByName(
            categoryData.name
        );

        if (existingCategory) {
            const error = new Error("Category already exists");
            error.statusCode = 409;
            throw error;
        }

        try {
            const category = await categoryRepository.create(categoryData);

            return category;
        } catch (error) {
            // Handle duplicate category from database
            if (
                error.code === "23505" &&
                error.constraint === "categories_name_unique_idx"
            ) {
                const conflictError = new Error("Category already exists");
                conflictError.statusCode = 409;
                throw conflictError;
            }

            throw error;
        }
    }

    async getAllCategories({ page, limit, is_active }, user) {
        // Only admins can filter inactive categories
        if (is_active === false && user?.role !== "admin") {
            const error = new Error(
                "Only admins can view inactive categories"
            );
            error.statusCode = 403;
            throw error;
        }

        const offset = (page - 1) * limit;

        const categories = await categoryRepository.findAll({
            limit,
            offset,
            is_active: is_active ?? true,
        });

        return {
            categories,
            pagination: {
                page,
                limit,
                count: categories.length,
            },
        };
    }

    async getCategoryById(id, user) {
        const category = await categoryRepository.findById(id);

        if (!category) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }

        // Inactive categories are visible only to admins
        if (!category.is_active && user?.role !== "admin") {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }

        return category;
    }

    async updateCategory(id, updateData) {
        // Check whether category exists
        const existingCategory = await categoryRepository.findById(id);

        if (!existingCategory) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }

        // Check for duplicate category name
        if (updateData.name) {
            const duplicateCategory = await categoryRepository.findByName(
                updateData.name
            );

            if (
                duplicateCategory &&
                String(duplicateCategory.id) !== String(id)
            ) {
                const error = new Error("Category already exists");
                error.statusCode = 409;
                throw error;
            }
        }

        try {
            const updatedCategory = await categoryRepository.update(
                id,
                updateData
            );

            return updatedCategory;
        } catch (error) {
            // Handle duplicate names caused by concurrent requests
            if (
                error.code === "23505" &&
                error.constraint === "categories_name_unique_idx"
            ) {
                const conflictError = new Error("Category already exists");
                conflictError.statusCode = 409;
                throw conflictError;
            }

            throw error;
        }
    }

}

export default new CategoryService();