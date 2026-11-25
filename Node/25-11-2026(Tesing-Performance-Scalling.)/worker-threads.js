
import http from "node:http";
import bcrypt from "bcrypt";
import { Worker } from "node:worker_threads";
import { performance } from "node:perf_hooks";

const PORT = 3000;
const SALT_ROUNDS = 12;

// Read request body
async function readBody(req) {
    let body = "";

    for await (const chunk of req) {
        body += chunk;

        if (body.length > 10_000) {
            throw new Error("Request body too large");
        }
    }

    return JSON.parse(body);
}

// Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

// Hash password on main thread
function hashOnMainThread(password) {
    const startTime = performance.now();

    const hashedPassword = bcrypt.hashSync(
        password,
        SALT_ROUNDS
    );

    const duration = performance.now() - startTime;

    return {
        hashedPassword,
        hashDurationMs: Number(duration.toFixed(2))
    };
}

// Hash password using worker thread
function hashOnWorkerThread(password) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./src/workers/bcrypt.worker.js", import.meta.url),
            {
                workerData: {
                    password,
                    saltRounds: SALT_ROUNDS
                }
            }
        );

        let settled = false;

        worker.once("message", (result) => {
            settled = true;

            if (result.success) {
                resolve(result);
            } else {
                reject(new Error(result.message));
            }
        });

        worker.once("error", (error) => {
            if (!settled) {
                settled = true;
                reject(error);
            }
        });

        worker.once("exit", (code) => {
            if (!settled) {
                settled = true;
                reject(
                    new Error(`Worker exited unexpectedly: ${code}`)
                );
            }
        });
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {

    // Test server responsiveness
    if (req.method === "GET" && req.url === "/ping") {
        return sendJSON(res, 200, {
            success: true,
            message: "Main thread is responsive",
            pid: process.pid
        });
    }

    // Password hashing routes
    if (
        req.method === "POST" &&
        (req.url === "/hash-main" || req.url === "/hash-worker")
    ) {
        const requestStart = performance.now();

        try {
            const { password } = await readBody(req);

            if (
                typeof password !== "string" ||
                password.trim().length === 0
            ) {
                return sendJSON(res, 400, {
                    success: false,
                    message: "Password is required"
                });
            }

            let result;
            let executionType;

            if (req.url === "/hash-main") {
                executionType = "Main thread";

                result = hashOnMainThread(password);
            } else {
                executionType = "Worker thread";

                result = await hashOnWorkerThread(password);
            }

            const totalDuration = performance.now() - requestStart;

            return sendJSON(res, 200, {
                success: true,
                executionType,
                pid: process.pid,
                hashDurationMs: result.hashDurationMs,
                totalResponseTimeMs: Number(
                    totalDuration.toFixed(2)
                ),
                hashedPassword: result.hashedPassword
            });

        } catch (error) {
            console.error("HASHING ERROR:", error);

            const statusCode =
                error.message === "Request body too large" ||
                error instanceof SyntaxError
                    ? 400
                    : 500;

            return sendJSON(res, statusCode, {
                success: false,
                message: error.message
            });
        }
    }

    // Unknown route
    return sendJSON(res, 404, {
        success: false,
        message: "Route not found"
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Main thread PID: ${process.pid}`);
});
