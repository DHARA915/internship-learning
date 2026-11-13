const path = require("path");

// POST upload image
function uploadImage(req, res) {
    // Check whether file was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please select an image to upload"
        });
    }

    res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`
        }
    });
}

module.exports = {
    uploadImage
};