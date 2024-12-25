/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modüller
 */
const router = require("express").Router(); // Düzeltildi

/**
 * özel modüller
 */
const {
  renderCreateBlog,
  postCreateBlog,
} = require("../controllers/create_blog_controller");

//GET route:Blog oluşturma sayfasını oluştur
router.get("/", renderCreateBlog);

//POST route:Blog oluşturma sayfasını oluştur
router.post("/", postCreateBlog);
const getReadingTime = require('../utils/get_reading_time_utils');

module.exports = router;
