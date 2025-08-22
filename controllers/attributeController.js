const asyncHandler = require("express-async-handler");
const Attribute = require("../models/Attribute");

// @desc    Get all attributes
// @route   GET /api/attributes
// @access  Private/Admin
const getAttributes = asyncHandler(async (req, res) => {
  const attributes = await Attribute.find({});
  res.json(attributes);
});

// @desc    Create a new custom attribute
// @route   POST /api/attributes
// @access  Private/Admin
const createAttribute = asyncHandler(async (req, res) => {
  const { name, type, defaultValue, options } = req.body;
  if (!name || !type) {
    res.status(400);
    throw new Error("Attribute name and type are required");
  }
  // Check if attribute already exists
  const exists = await Attribute.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error("Attribute already exists");
  }
  const attribute = new Attribute({
    name,
    type,
    defaultValue,
    options: options || [],
    isMandatory: false, // new attributes are custom by default
  });
  const createdAttribute = await attribute.save();
  res.status(201).json(createdAttribute);
});

// @desc    Update a custom attribute
// @route   PUT /api/attributes/:id
// @access  Private/Admin
const updateAttribute = asyncHandler(async (req, res) => {
  const { name, type, defaultValue, options } = req.body;
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    res.status(404);
    throw new Error("Attribute not found");
  }
  // Although middleware checks for mandatory attributes,
  // we add an extra check here for safety.
  if (attribute.isMandatory) {
    res.status(400);
    throw new Error("Cannot update a mandatory attribute");
  }
  attribute.name = name || attribute.name;
  if (type) attribute.type = type;
  if (defaultValue !== undefined) attribute.defaultValue = defaultValue;
  if (options) attribute.options = options;
  const updatedAttribute = await attribute.save();
  res.json(updatedAttribute);
});

// @desc    Delete a custom attribute
// @route   DELETE /api/attributes/:id
// @access  Private/Admin
const deleteAttribute = asyncHandler(async (req, res) => {
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    res.status(404);
    throw new Error("Attribute not found");
  }
  if (attribute.isMandatory) {
    res.status(400);
    throw new Error("Cannot delete a mandatory attribute");
  }
  await attribute.remove();
  res.json({ message: "Attribute removed" });
});

module.exports = {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};
