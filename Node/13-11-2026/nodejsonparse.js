// Task:4  Q:2 Parse JSON body from a POST request in the raw HTTP server (read chunks, JSON.parse)


const http = require("http");

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        return res.end("Welcome to Home Page");
    }

    // POST /data
    if (req.method === "POST" && req.url === "/data") {

        let body = "";

        // Read incoming data chunks
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        // Execute when all chunks are received
        req.on("end", () => {

            try {
                const data = JSON.parse(body);

                console.log("Received Data:", data);

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Data received successfully",
                    data: data
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Invalid JSON"
                }));
            }
        });

        return;
    }

    // 404 - Unknown routes
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Route Not Found"
    }));
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
