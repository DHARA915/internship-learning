
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is required"
      });
    }

    // Extract token after "Bearer ".
    const token = authHeader.split(" ")[1];

    // Verify JWT signature and expiration.
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );


    // Attach authenticated user information.
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token"
    });
  }
};

export default authenticate;
