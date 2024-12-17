/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * node modüller
 */
const router = require("express").Router();

/**
 * özel modüller
 */
const { renderReadingList } = require("../controllers/reading_list_controller");

//Get route:Okuma listesi sayfasını getir
router.get(["/", "/page/:pageNumber"], renderReadingList);
module.exports = router;
