const express = require("express");
const router = express.Router();
const {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} = require("../controllers/attributeController");
const { checkAttributeNotMandatory } = require("../middleware/attributeMiddleware");

// GET all attributes, POST to create a new custom attribute
router.route("/")
  .get(getAttributes)
  .post(createAttribute);

// PUT and DELETE routes with middleware to prevent modifying mandatory attributes
router.route("/:id")
  .put(checkAttributeNotMandatory, updateAttribute)
  .delete(checkAttributeNotMandatory, deleteAttribute);

module.exports = router;
