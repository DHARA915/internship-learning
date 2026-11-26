import categoryService from "../services/category.service.js";

class CategoryController {

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: {
          category,
        },
      });

    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const { page, limit, is_active } = res.locals.validated.query;

      const categories = await categoryService.getAllCategories(
        {
          page,
          limit,
          is_active:
            is_active === undefined
              ? undefined
              : is_active === "true",
        },
        req.user
      );

      return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { id } = res.locals.validated.params;

      const category = await categoryService.getCategoryById(
        id,
        req.user
      );

      return res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = res.locals.validated.params;
      const updateData = req.body;

      const category = await categoryService.updateCategory(
        id,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }

}

export default new CategoryController();