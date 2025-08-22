// backend/routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route("/:productId")
  .delete(protect, removeFromWishlist);

module.exports = router;
