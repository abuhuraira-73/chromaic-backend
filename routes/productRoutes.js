const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// POST to create and GET to list products
router.route("/")
  .post(upload.array("images", 5), createProduct)
  .get(getProducts);

// GET a single product by its ID
router.route("/:id").get(getProductById);

module.exports = router;
