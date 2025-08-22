const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const User = require("../models/User");
const { v4: uuidv4 } = require('uuid');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    taxPrice,
    giftWrap,
    giftWrapPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Generate a unique order number with timestamp prefix
  const timestamp = new Date().getTime().toString().slice(-6);
  const uniqueId = uuidv4().slice(0, 6);
  const orderNumber = `ORD-${timestamp}-${uniqueId}`;

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    taxPrice,
    giftWrap: giftWrap || false,
    giftWrapPrice: giftWrapPrice || 0,
    totalPrice,
    orderNumber
  });

  const createdOrder = await order.save();

  // Clear the user's cart after creating the order
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = [];
    await user.save();
  }

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    // Ensure the order belongs to the logged-in user or is an admin
    if (
      order.user._id.toString() === req.user._id.toString() || 
      req.user.isAdmin
    ) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address || order.shippingAddress.email,
      cardLastFour: req.body.cardLastFour || "9999", // For dummy payment
      cardType: req.body.cardType || "Visa" // For dummy payment
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name email");
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getOrders,
  updateOrderStatus
};
