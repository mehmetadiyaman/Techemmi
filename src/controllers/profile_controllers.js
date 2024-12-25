/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * özel modüller
 */
const User = require("../models/user_model");
const Blog = require("../models/blog_model");
const getPagination = require("../utils/get_pagination_util");
const { create } = require("connect-mongo");
/**
 * Profil sayfasını göster
 * @async
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */

const renderProfile = async (req, res) => {
  try {
    //İstek parametresinden kullanıcı adını çıkart
    const { username } = req.params;
    //Kulanıcı mevcut olmadığı durumu ele al
    const userExists = await User.exists({ username });
    if (!userExists) {
      return res.render("./pages/404");
    }
    //Kullanıcı adına göre kullanıcı profili bul
    const profile = await User.findOne({ username }).select(
      "profilePhoto username name bio blogs blogPublished createdAt"
    );
    //Sayfalama verilerini oluşturma
    const pagination = getPagination(
      `/profile/${username}`,
      req.params,
      20,
      profile.blogs.length
    );
    //Sayfa numarası ve diğer kriterlere göre profil bloglarını alma
    const profileBlogs = await Blog.find({ _id: { $in: profile.blogs } })
      .select("title createdAt reaction totalBookmark readingTime")
      .populate({ path: "owner", select: "name username profilePhoto" })
      .sort({ createdAt: "desc" })
      .limit(pagination.limit)
      .skip(pagination.skip);

    //Alınan verilerle profil sayfasını oluştur
    res.render("./pages/profile", {
      sessionUser: req.session.user,
      profile,
      profileBlogs,
      pagination,
    });
  } catch (error) {
    console.error("profil oluşturma hatası: ", error.message);
    throw error;
  }
};
module.exports = renderProfile;
