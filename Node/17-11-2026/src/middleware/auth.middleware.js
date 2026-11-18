
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        

        // Check whether token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        // Attach user information to request
        req.user = {
            id: decoded.sub,
            role: decoded.role
        };

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token has expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid access token"
        });
    }
};

export default authMiddleware;
