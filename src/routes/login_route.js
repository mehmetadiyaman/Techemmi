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
const { renderLogin, postLogin } = require("../controllers/login_controller");

//GET route:Giriş formununu göster
router.get("/", renderLogin);

//POST route:Kullanıcı giriş formunu gönder
router.post("/", postLogin);

module.exports = router;
