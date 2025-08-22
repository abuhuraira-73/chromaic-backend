const express = require("express");
const router = express.Router();
const { createCategory, getCategories, getCategoryById } = require("../controllers/categoryController");

router.route("/")
  .post(createCategory)
  .get(getCategories);

router.route("/:id").get(getCategoryById);

module.exports = router;
