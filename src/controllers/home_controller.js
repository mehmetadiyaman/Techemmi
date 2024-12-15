/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * özel modüller
 */
const Blog = require("../models/blog_model");
const getPagination = require("../utils/get_pagination_util");

/**
 * Ana sayfaya blog verilerini işleme ve denetleme
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */
const renderHome = async (req, res) => {
  try {
    //Oluşturulan toplam miktarı al
    const totalBlogs = await Blog.countDocuments();
    //sayfalandırma nesnesini al(pagination)
    const pagination = getPagination("/", req.params, 12, totalBlogs);
    //Veritabanında belirli alanları owner fiel ile doldurma
    const latestBlogs = await Blog.find()
      .select(
        "banner author createdAt readingTime title reaction totalBookmark"
      )
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .sort({ createdAt: "desc" })
      .limit(pagination.limit)
      .skip(pagination.skip);
    res.render("./pages/home", {
      sessionUser: req.session.user,
      latestBlogs,
      pagination,
    });
  } catch (error) {
    //Ana sayfa oluşturulmasında hatta varsa log kontrolü yap
    console.error("Ana sayfa oluşturulurken bir hata oluştu", error.message);
    throw error;
  }
};
module.exports = renderHome;
