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
const renderBlogDetail = require("../controllers/blog_detail_controller"); // Doğru fonksiyonu içe aktar
const {
  updateReaction,
  deleteReaction,
} = require("../controllers/reaction_controller");
const {
  addToReadingList,
  removeFromReadingList,
} = require("../controllers/reading_list_controller");

const updateVisit = require("../controllers/visit_controller");

// GET route: Blog ayrıntı sayfası
router.get("/:blogId", renderBlogDetail); // Doğru fonksiyonu kullanmalısınız

// PUT route: Blog reaksiyonları güncelleme,ekleme
router.put("/:blogId/reactions", updateReaction);

// DELETE route: Blog reaksiyonları Ssilme
router.delete("/:blogId/reactions", deleteReaction);

// PUT route: Blog Okuma güncelleme,ekleme
router.put("/:blogId/readingList", addToReadingList);

// DELETE route: Blog Okuma listesi silme
router.delete("/:blogId/readingList", removeFromReadingList);

// PUT route: Blog görünürlüğü güncelleme
router.put("/:blogId/visit", updateVisit);

module.exports = router;
