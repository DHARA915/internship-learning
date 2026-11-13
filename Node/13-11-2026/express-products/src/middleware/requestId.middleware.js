const { randomUUID } = require("crypto");

function requestIdMiddleware(req, res, next) {

    const id = randomUUID();

    req.requestId = id;

    res.setHeader("X-Request-ID", id);

    // Store original res.json method
    const originalJson = res.json.bind(res);

    // Override res.json method
    res.json = (data) => {

        const response = {
            ...data,
            requestId: req.requestId
        };

        return originalJson(response);
    };

    next();
}

module.exports = requestIdMiddleware;