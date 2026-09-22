const express = require("express");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protected admin dashboard
router.get("/dashboard", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome to the Admin Dashboard!",
        user: req.user
    });
});

module.exports = router;