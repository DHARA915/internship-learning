import { verifyAccessToken } from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";

// Required authentication
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Access token is required");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Access token is required");
      error.statusCode = 401;
      throw error;
    }

    // Verify JWT
    const decoded = verifyAccessToken(token);

    // Fetch current user from database
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      const error = new Error("User account not found");
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error("Your account has been deactivated");
      error.statusCode = 403;
      throw error;
    }

    // Attach current user details to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid or expired access token";
    }

    next(error);
  }
};

// Optional authentication
export const optionalAuthenticate = (req, res, next) => {
  // No Authorization header: continue as public user
  if (!req.headers.authorization) {
    return next();
  }

  // Authorization header exists: validate it
  return authenticate(req, res, next);
};

export { authenticate };

export default authenticate;
