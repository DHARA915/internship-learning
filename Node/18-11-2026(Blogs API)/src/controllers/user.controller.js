import userRepository from "../repositories/user.repository.js";
import userService from '../services/user.service.js'


const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// GetAllUsers
const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(
      req.validatedQuery
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// GetUserById
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        user: deletedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
};