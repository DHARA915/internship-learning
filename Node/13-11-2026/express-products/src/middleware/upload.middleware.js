const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

// Upload directory
const uploadDir = path.join(__dirname, "../../uploads");

// Create uploads directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, `${randomUUID()}${extension}`);
    }
});

// Validate file type
function fileFilter(req, file, cb) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
        allowedExtensions.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype)
    ) {
        return cb(null, true);
    }

    const error = new Error("Only JPG, JPEG and PNG images are allowed");
    error.statusCode = 400;

    cb(error);
}

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;