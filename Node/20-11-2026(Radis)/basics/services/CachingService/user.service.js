import redis from "../../config/redis.js";

class UserService {
  // Store user in Redis Hash
  async createUser(user) {
    const key = `user:${user.id}`;

    await redis.hset(key, {
      id: String(user.id),
      name: user.name,
      email: user.email,
      age: String(user.age)
    });

    return {
      message: "User stored successfully"
    };
  }

  // Retrieve one field
  async getUserName(userId) {
    return await redis.hget(`user:${userId}`, "name");
  }

  // Retrieve complete user
  async getUser(userId) {
    const user = await redis.hgetall(`user:${userId}`);

    if (Object.keys(user).length === 0) {
      return null;
    }

    return {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      age: Number(user.age)
    };
  }
}

export default new UserService();