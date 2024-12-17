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
const logout = require("../controllers/logout_controller");

//POST route:Kullanıcı çıkış işlemi
router.post("/", logout);

module.exports = router;