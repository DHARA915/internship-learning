const express = require("express");
const router = express.Router();

// GET all users
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Users route is working"
    });
});

module.exports = router;