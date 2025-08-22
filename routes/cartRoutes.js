// backend/routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getCart)
  .post(protect, addToCart);

router.route("/:id")
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
