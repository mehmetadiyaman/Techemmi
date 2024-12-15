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
const {
  renderBlogEdit,
  updateBlog,
} = require("../controllers/blog_update_controller");

//GET route:Blog düzenlem sayfasını getir
router.get("/:blogId/edit", renderBlogEdit);

//PUT route:blog güncellemeleri
router.put("/:blogId/edit", updateBlog);
module.exports = router;
