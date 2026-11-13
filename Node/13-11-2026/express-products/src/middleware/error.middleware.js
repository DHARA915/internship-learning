
function errorHandler(err, req, res, next) {

    // Get status code
    const statusCode = err.statusCode || 500;

        // Handle Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 413;
        err.message = "File size must not exceed 5MB";
    } else if (err.code && err.code.startsWith("LIMIT_")) {
        statusCode = 400;
    }

    // Send structured error response
    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: err.message || "Internal Server Error"
        }
    });
}

module.exports = errorHandler;
