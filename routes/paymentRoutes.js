// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { 
  processPayment, 
  getPaymentStatus, 
  simulatePaymentFailure 
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.route("/process")
  .post(protect, processPayment);

router.route("/status/:paymentId")
  .get(protect, getPaymentStatus);

router.route("/simulate-failure")
  .post(protect, simulatePaymentFailure);

module.exports = router; 