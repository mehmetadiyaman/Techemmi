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
  renderRegister,
  postRegister,
} = require("../controllers/register_controller");

/**
 * özel modüller
 */
const renderHome = require("../controllers/home_controller");

//GET route:Ana sayfayı göster
router.get(["/", "/page/:pageNumber"], renderHome);

module.exports = router;
