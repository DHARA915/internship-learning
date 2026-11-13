// Logger middleware...

const logger = (req, res, next) => {

    // Record request start time
    const startTime = Date.now();

    // Listen for response completion

    res.on("finish", () => {
        const responseTime = Date.now() - startTime;
        // Log request details
        console.log(
            `${req.method} ${req.originalUrl} | ` +
            `Status: ${res.statusCode} | ` +
            `Response Time: ${responseTime}ms`
        );

    })


    // Pass control to the next middleware
    next();

}

module.exports = logger;