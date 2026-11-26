import userRepository from "../repositories/user.repository.js";

import { getCache, setCache , deleteCache , deleteCachePattern } from "../utils/cache.js";

class UserService {

 async getAllUsers({ page = 1, limit = 10 }) {
  const cacheKey = `ecommerce:users:list:page:${page}:limit:${limit}`;

  // 1. Check Redis cache
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    console.log("Users cache HIT:", cacheKey);
    return cachedData;
  }

  console.log("Users cache MISS:", cacheKey);

  // 2. Fetch from PostgreSQL
  const offset = (page - 1) * limit;

  const result = await userRepository.findAll({
    limit,
    offset,
  });

  const response = {
    users: result.users,
    pagination: {
      totalUsers: result.total,
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      limit,
    },
  };

  // 3. Store response in Redis (5 minutes)
  await setCache(cacheKey, response);

  return response;
}

async getUserById(id) {
  const cacheKey = `ecommerce:user:${id}`;

  // 1. Check Redis
  const cachedUser = await getCache(cacheKey);

  if (cachedUser) {
    console.log("User cache HIT:", cacheKey);
    return cachedUser;
  }

  console.log("User cache MISS:", cacheKey);

  // 2. Fetch from PostgreSQL
  const user = await userRepository.findByIdForAdmin(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Store in Redis for 5 minutes
  await setCache(cacheKey, user);

  return user;
}

async updateUser(id, updateData, currentUser) {
  // Customers can update only their own name and email
  if (currentUser.role !== "admin") {

    // Customer cannot update another user's account
    if (String(currentUser.id) !== String(id)) {
      const error = new Error(
        "You cannot update another user's account"
      );
      error.statusCode = 403;
      throw error;
    }

    // Customers cannot change role or account status
    if ("role" in updateData || "is_active" in updateData) {
      const error = new Error(
        "You are not allowed to update role or account status"
      );
      error.statusCode = 403;
      throw error;
    }
  }

  // Check whether user exists
  const existingUser = await userRepository.findByIdForAdmin(id);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  let updatedUser;

  try {
    updatedUser = await userRepository.update(id, updateData);

    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

  } catch (error) {
    if (
      error.code === "23505" &&
      error.constraint === "users_email_key"
    ) {
      const conflictError = new Error(
        "Email is already registered"
      );
      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  }

  // Invalidate individual user cache
  await deleteCache(`ecommerce:user:${id}`);

  // Invalidate all user-list pagination caches
  await deleteCachePattern("ecommerce:users:list:*");

  return updatedUser;
}

}

export default new UserService();