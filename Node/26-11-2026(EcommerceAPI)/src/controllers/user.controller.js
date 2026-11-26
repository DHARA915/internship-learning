import userService from "../services/user.service.js";

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userService.getAllUsers({
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {

      const { id } = res.locals.validated.params;
      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
  try {
    const { id } = res.locals.validated.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(
      id,
      updateData,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

}

export default new UserController();