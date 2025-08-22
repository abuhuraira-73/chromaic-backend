const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin (currently public until auth is added)
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    price,
    salePrice,
    colors,    // expected as a JSON string from the frontend
    sizes,     // expected as a JSON string from the frontend
    discount,
    description,
    stock,
    category,
    sku,
    tags,      // expected as a JSON string representing an array
    attributes, // expected as a JSON string from the frontend for custom attribute values
  } = req.body;

  // Validate that images were uploaded via multer
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image.");
  }

  // Get permanent image URLs from Cloudinary (multer-storage-cloudinary sets file.path)
  const imagePreviews = req.files.map((file) => file.path);

  // Parse colors and sizes from JSON strings
  let parsedColors = [];
  let parsedSizes = [];
  try {
    parsedColors = colors ? JSON.parse(colors) : [];
  } catch (error) {
    parsedColors = [];
  }
  try {
    parsedSizes = sizes ? JSON.parse(sizes) : [];
  } catch (error) {
    parsedSizes = [];
  }

  // Parse custom attributes from JSON string (if provided)
  let parsedAttributes = [];
  try {
    parsedAttributes = attributes ? JSON.parse(attributes) : [];
  } catch (error) {
    parsedAttributes = [];
  }

  // Parse tags from JSON string (expected to be an array)
  let parsedTags = [];
  try {
    parsedTags = tags ? JSON.parse(tags) : [];
  } catch (error) {
    parsedTags = [];
  }

  // Ensure each color object has an image property
  parsedColors = parsedColors.map((color) => ({
    ...color,
    image:
      color.image && color.image.trim() !== ""
        ? color.image
        : imagePreviews[0] || "http://placehold.it/100x100",
  }));

  // Generate a unique Product ID using the current timestamp
  const productId = Date.now().toString();

  const product = new Product({
    productId,
    images: imagePreviews,
    title,
    price: Number(price),
    salePrice: Number(salePrice),
    colors: parsedColors,
    sizes: parsedSizes,
    discount: Number(discount),
    description,
    stock: Number(stock),
    category,
    sku,
    tags: parsedTags,
    attributes: parsedAttributes,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get a product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = { createProduct, getProducts, getProductById };
