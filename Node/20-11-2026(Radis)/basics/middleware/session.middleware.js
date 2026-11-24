import session from "express-session";
import { RedisStore } from "connect-redis";

import sessionRedis from "../config/sessionRedis.js";

const sessionMiddleware = session({
    store: new RedisStore({
        client: sessionRedis,
        prefix: "sess:"
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.SESSION_MAX_AGE) || 86400000
    }
});

export default sessionMiddleware;