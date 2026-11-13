// Tash:4  Q:1 Create a raw HTTP server (no Express) that responds to GET /, GET /about, POST /data, returns 404 for unknown routes

const http = require('http');

// create HTTP server

const server = http.createServer((req, res) => {
    // GET

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200,
            {
                "Content-Type": "text/plain"
            }
        )
        res.end("Welcome to Home Page");
    }

    // GET /about
    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("This is About Page");
    }

    // POST /data
    else if (req.method === "POST" && req.url === "/data") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Data received successfully"
        }));
    }

    // 404 - Unknown routes
    else {
        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            error: "404 - Route Not Found"
        }));
    }

})

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});