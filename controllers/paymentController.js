const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const { v4: uuidv4 } = require('uuid');

// For dummy payment processing
const validateCreditCard = (cardNumber) => {
  // Implement basic validation like Luhn algorithm or just check length
  // For demo purposes, let's consider any card number valid except a specific test failure number
  if (cardNumber === "4000000000000002") {
    return { valid: false, message: "Card declined. Please try another payment method." };
  }
  
  // Basic validation - check if it's a 16-digit number
  if (!/^\d{16}$/.test(cardNumber)) {
    return { valid: false, message: "Invalid card number format" };
  }
  
  return { valid: true };
};

// @desc    Process payment
// @route   POST /api/payment/process
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { orderId, cardNumber, cardExpiry, cvv, cardName } = req.body;
  
  // Validate required fields
  if (!orderId || !cardNumber || !cardExpiry || !cvv || !cardName) {
    res.status(400);
    throw new Error("Please provide all payment details");
  }

  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Validate order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to process payment for this order");
    }

    // Check if order is already paid
    if (order.isPaid) {
      res.status(400);
      throw new Error("Order is already paid");
    }

    // Validate credit card (dummy validation)
    const cardValidation = validateCreditCard(cardNumber);
    if (!cardValidation.valid) {
      res.status(400);
      throw new Error(cardValidation.message || "Invalid card details");
    }

    // Generate a payment ID
    const paymentId = uuidv4();
    
    // Get last 4 digits of card
    const cardLastFour = cardNumber.slice(-4);
    
    // Determine card type based on first digit (simplified)
    let cardType = "Unknown";
    if (cardNumber.startsWith("4")) {
      cardType = "Visa";
    } else if (cardNumber.startsWith("5")) {
      cardType = "MasterCard";
    } else if (cardNumber.startsWith("3")) {
      cardType = "American Express";
    } else if (cardNumber.startsWith("6")) {
      cardType = "Discover";
    }

    // Update order with payment information
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentId,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
      cardLastFour,
      cardType
    };

    const updatedOrder = await order.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      orderId: order._id,
      paymentId,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500);
    throw new Error("Payment processing failed: " + error.message);
  }
});

// @desc    Get payment status
// @route   GET /api/payment/status/:paymentId
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  // Find order with this payment ID
  const order = await Order.findOne({"paymentResult.id": paymentId});
  
  if (!order) {
    res.status(404);
    throw new Error("Payment not found");
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to view this payment");
  }

  // Return payment status
  res.json({
    paymentId,
    status: order.paymentResult.status,
    orderId: order._id,
    orderNumber: order.orderNumber,
    paidAt: order.paidAt,
    amount: order.totalPrice
  });
});

// @desc    Simulate payment failure (for testing)
// @route   POST /api/payment/simulate-failure
// @access  Private
const simulatePaymentFailure = asyncHandler(async (req, res) => {
  // This endpoint is for testing purposes to simulate a payment failure
  res.status(400).json({
    success: false,
    message: "Payment failed",
    error: "Card declined. Please try another payment method."
  });
});

module.exports = { processPayment, getPaymentStatus, simulatePaymentFailure }; 