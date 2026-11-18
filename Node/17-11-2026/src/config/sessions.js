import session from "express-session"
import connectPgSimple from "connect-pg-simple"

import pool from "./db.js"

// Create PostgreSQL session store
const PgSession = connectPgSimple(session);

const sessionMiddleware = session({

    // Store session data in PostgreSQL
    store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true
    }),

    // Secret used to sign the session ID cookie
    secret: process.env.SESSION_SECRET,

    // Don't save unchanged sessions
    resave: false,

    // Don't create empty sessions
    saveUninitialized: false,

    // Cookie configuration
    cookie: {
        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: "lax",

        maxAge:
            Number(process.env.SESSION_MAX_AGE) ||
            7 * 24 * 60 * 60 * 1000
    }
});

export default sessionMiddleware;