const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3001"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        const error = new Error("Not allowed by CORS");
        error.statusCode = 403;

        callback(error);
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Request-ID"
    ],

    credentials: true
};

module.exports = cors(corsOptions);