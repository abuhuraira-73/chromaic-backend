// backend/controllers/wishlistController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product"); // Assuming your product model is named Product

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  // Check if product exists (optional but recommended)
  const productExists = await Product.findById(productId);
  if (!productExists) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Check if product is already in wishlist
    const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);

    if (alreadyAdded) {
      res.status(400);
      throw new Error("Product already in wishlist");
    }

    user.wishlist.push(productId);
    await user.save();
    res.status(201).json({ message: "Product added to wishlist" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  if (user) {
    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    if (user.wishlist.length === initialLength) {
      res.status(404);
      throw new Error("Product not found in wishlist");
    }

    await user.save();
    res.json({ message: "Product removed from wishlist" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
