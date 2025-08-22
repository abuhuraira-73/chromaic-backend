const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    // Unique Product ID (generated automatically in the controller)
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    // Array of image URLs
    images: {
      type: [String],
      required: true,
    },
    // Product title/name
    title: {
      type: String,
      required: true,
    },
    // Regular price
    price: {
      type: Number,
      required: true,
    },
    // Sale price
    salePrice: {
      type: Number,
      required: true,
    },
    // Color variants as an array of objects
    colors: {
      type: [
        {
          name: { type: String, required: true },
          className: { type: String },
          image: { type: String, required: true },
        },
      ],
      required: true,
    },
    // Size variants as an array of strings
    sizes: {
      type: [String],
      required: true,
    },
    // Discount percentage (new field)
    discount: {
      type: Number,
      default: 0,
    },
    // Short description of the product
    description: {
      type: String,
      required: true,
    },
    // Available stock quantity
    stock: {
      type: Number,
      required: true,
    },
    // Category (stored but not shown publicly)
    category: {
      type: String,
      required: true,
    },
    // SKU for internal tracking (hidden)
    sku: {
      type: String,
      required: true,
    },
    // Tags (updated to be an array of strings)
    tags: {
      type: [String],
      required: true,
    },
    // Custom attributes for the product (custom attribute values)
    attributes: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
