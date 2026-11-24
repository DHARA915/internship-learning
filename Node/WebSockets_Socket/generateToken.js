import "dotenv/config";
import jwt from "jsonwebtoken";

const adminToken = jwt.sign(
    {
        id: "admin123",
        email: "admin@example.com",
        role: "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

console.log("ADMIN TOKEN:", adminToken);