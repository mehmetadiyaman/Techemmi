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
const renderDashboard = require("../controllers/dashboard_controller");

//GET route:panel sayfasını  getir
router.get("/", renderDashboard);

module.exports = router;
