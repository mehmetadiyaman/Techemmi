/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact_controller");
const contactValidator = require("../middlewares/contact_validator");

router.get("/", contactController.getContactPage);
router.post("/", contactValidator.validateContactForm, contactController.submitContact);

module.exports = router;
