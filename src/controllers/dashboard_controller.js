/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const { create } = require("connect-mongo");
/**
 * node modüller
 */

/**
 * özel modüller
 */
const User = require("../models/user_model");

/**
 * Profil sayfasını göster
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */

const renderDashboard = async (req, res) => {
  try {
    const { username } = req.session.user;
    const loggedUser = await User.findOne({ username })
      .select("totalVisits totalReactions blogPublished blogs")
      .populate({
        path: "blogs",
        select: "title createdAt updatedAt reaction totalVisit",
        options: { sort: { createdAt: "desc" } },
      });
    res.render("./pages/dashboard", {
      sessionUser: req.session.user,
      loggedUser,
    });
  } catch (error) {
    console.error("Göstege paneli kısmında bir hatta oluştu", error.message);
    throw error;
  }
};
module.exports = renderDashboard;
