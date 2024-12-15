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
const deleteBlog = require("../controllers/blog_delete_controller");

//DELETE route:Blog düzenlem sayfasını getir
router.delete("/:blogId/delete", deleteBlog);

module.exports = router;
