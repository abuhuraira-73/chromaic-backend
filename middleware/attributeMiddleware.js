const asyncHandler = require("express-async-handler");
const Attribute = require("../models/Attribute");

const checkAttributeNotMandatory = asyncHandler(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    res.status(404);
    throw new Error("Attribute not found");
  }
  if (attribute.isMandatory) {
    res.status(400);
    throw new Error("Operation not allowed on mandatory attribute");
  }
  next();
});

module.exports = { checkAttributeNotMandatory };
