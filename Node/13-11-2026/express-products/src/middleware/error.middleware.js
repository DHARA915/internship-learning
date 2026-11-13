
function errorHandler(err, req, res, next) {

    // Get status code
    const statusCode = err.statusCode || 500;

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
