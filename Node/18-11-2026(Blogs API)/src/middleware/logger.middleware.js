import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

import logger from "../config/logger.js";

const loggerMiddleware = pinoHttp({

    logger,

    // Generate unique ID for every request
    genReqId: (req, res) => {

        const requestId = randomUUID();

        res.setHeader("X-Request-ID", requestId);

        return requestId;
    },

    // Rename default Pino HTTP log fields
    customAttributeKeys: {
        reqId: "requestId",
        responseTime: "responseTime"
    },

    // Message for successful responses
    customSuccessMessage: () => {
        return "Request completed";
    },

    // Message for failed responses
    customErrorMessage: () => {
        return "Request errored";
    }

});

export default loggerMiddleware;