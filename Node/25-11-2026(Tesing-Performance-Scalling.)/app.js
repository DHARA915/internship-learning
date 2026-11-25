
import express from "express";
import compression from "compression";

const app = express();
const PORT = 3000;

// Compression middleware
app.use(compression());

app.use(express.json());

// Compression testing route
app.get("/compression-test", (req, res) => {
    const data = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: "developer",
        description: "This is a sample response used to test HTTP compression."
    }));

    res.json({
        success: true,
        total: data.length,
        users: data
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Node.js application is healthy"
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
