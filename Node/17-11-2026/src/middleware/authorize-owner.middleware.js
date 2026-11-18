
const authorizeOwnerOrAdmin = (req, res, next) => {

    // Check authentication
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    // Admin can update any user
    if (req.user.role === "admin") {
        return next();
    }

    // User can update only their own account
    if (String(req.user.id) === String(req.params.id)) {
        return next();
    }

    // Otherwise deny access
    return res.status(403).json({
        success: false,
        message: "You can only update your own account"
    });
};

export default authorizeOwnerOrAdmin;
