const express = require("express");
const router = express.Router();
const { getAllUsers, inactivateUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Apply protect and admin middleware for admin-only routes
router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id/inactivate", protect, admin, inactivateUser);

module.exports = router;
