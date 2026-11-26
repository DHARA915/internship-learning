import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

const app = express();

// Security middleware
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// HTTP request logging
app.use(pinoHttp());

// Basic welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running",
  });
});

export default app;