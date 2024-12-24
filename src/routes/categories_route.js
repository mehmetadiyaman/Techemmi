// src/routes/categories_route.js

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category_controller");

// Dinamik kategori rotası
router.get("/:categoryName", categoryController.getCategory);

module.exports = router;
