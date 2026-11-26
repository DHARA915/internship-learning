import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = (req, res, next) => {
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

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError" ||
        error.name === "NotBeforeError") {
      error.statusCode = 401;
      error.message = "Invalid or expired access token";
    }

    next(error);
  }
};

export default authenticate;