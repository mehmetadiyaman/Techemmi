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

// GET route: kayıt formu işleme
router.get("/", renderRegister);

//POST route: kullanıcı kaydı için form kaydını yönetir
router.post("/", postRegister);

module.exports = router;
