/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";
const User = require("../models/user_model.js");

/**
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const userAuth = (req, res, next) => {
  const { userAuthenticated } = req.session.user || {}; // 'userAuthenticated' adını doğru yazdık
  if (userAuthenticated) return next();
  res.redirect("/login");
};

module.exports = userAuth;
git 