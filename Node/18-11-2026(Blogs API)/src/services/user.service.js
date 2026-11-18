import userRepository from "../repositories/user.repository.js";

const getAllUsers = async ({ limit, offset }) => {
  const result = await userRepository.findAll({
    limit,
    offset
  });

  const totalPages = Math.ceil(result.total / limit);

  return {
    users: result.users,
    pagination: {
      totalUsers: result.total,
      limit,
      offset,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages,
      hasNextPage: offset + limit < result.total,
      hasPreviousPage: offset > 0
    }
  };
};

// GetUser By id
const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

//Update User
const updateUser = async (userId, updates) => {
  // Check whether the user exists.
  const existingUser = await userRepository.findById(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Check whether the email is already used.
  if (updates.email) {
    const emailUser = await userRepository.findUserByEmail(
      updates.email
    );

    if (emailUser && emailUser.id !== userId) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  // Update user details.
  const updatedUser = await userRepository.updateUser(
    userId,
    updates
  );

  return updatedUser;
};

//Delete User
const deleteUser = async (userId) => {
  const existingUser = await userRepository.findById(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  try {
    return await userRepository.deleteUser(userId);
  } catch (error) {
    // PostgreSQL foreign-key constraint violation.
    if (error.code === "23503") {
      const conflictError = new Error(
        "Cannot delete this user because they have associated posts or comments"
      );

      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};