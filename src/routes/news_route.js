const express = require("express");
const router = express.Router();
const {
  getNewsByCategory,
  getImage,
} = require("../controllers/news_controller");

// Ana kategori route'u
router.get("/:category", getNewsByCategory);

// Sayfalama için route
router.get("/:category/page/:pageNumber", getNewsByCategory);

// Görsel route'u
router.get("/news/image/:id", getImage);

module.exports = router;
