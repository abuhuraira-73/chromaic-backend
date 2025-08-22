const express = require("express");
const router = express.Router();
const { registerUser, authUser, updatePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Routes for user registration and login
router.post("/register", registerUser);
router.post("/login", authUser);

// Protected routes
router.put("/password", protect, updatePassword);

module.exports = router;
