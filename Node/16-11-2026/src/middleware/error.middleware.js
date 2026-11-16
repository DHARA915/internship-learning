
const errorMiddleware = (error, req, res, next) => {

    console.error("Database/API Error:", error);

    // Default error response
    let statusCode = 500;
    let message = "Internal Server Error";

    // PostgreSQL unique violation
    if (error.code === "23505") {

        statusCode = 409;
        message = "Record already exists";

    }

    // PostgreSQL foreign key violation
    else if (error.code === "23503") {

        statusCode = 400;
        message = "Invalid foreign key reference";

    }

    // PostgreSQL not null violation
    else if (error.code === "23502") {

        statusCode = 400;
        message = "Required database field is missing";

    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message
    });

};

export default errorMiddleware;
