// backend/controllers/cartController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add a product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, color, size } = req.body; // Updated to match frontend
  const user = await User.findById(req.user._id);
  
  if (user) {
    // First fetch the product details to get required fields
    const Product = require("../models/Product");
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    // Check if product already exists in cart with same options
    const existingItem = user.cart.find(
      (item) => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    );
    
    if (existingItem) {
      // If exists, update quantity
      existingItem.quantity += quantity || 1;
    } else {
      // Add new product to cart with ALL required fields
      user.cart.push({
        id: productId,
        name: product.title, // Field mapping: title in Product -> name in cart
        images: product.images || [],
        price: product.price,
        salePrice: product.salePrice || product.price,
        description: product.description,
        quantity: quantity || 1,
        color,
        size
      });
    }
    
    await user.save();
    res.status(201).json(user.cart);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    const item = user.cart.find((item) => item.id === req.params.id);
    if (item) {
      item.quantity = quantity;
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404);
      throw new Error("Cart item not found");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Remove a product from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = user.cart.filter((item) => item.id !== req.params.id);
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
