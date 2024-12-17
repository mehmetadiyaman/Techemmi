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
const renderProfile = require("../controllers/profile_controllers");

//GET route:Profil sayfasını  getir
router.get(["/:username", "/:usermame/page/:pageNumber"], renderProfile);

module.exports = router;
