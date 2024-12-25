/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modülleri
 */
const mongoose = require("mongoose");

/**
 * özel modüller
 */
const Blog = require("../models/blog_model");
const User = require("../models/user_model");
//const { handleReaction } = require('../controllers/reaction_controller');

const markdown = require("../config/markdown_it_config");

/**
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */
const renderBlogDetail = async (req, res) => {
  try {
    // blogId istek parametrelerini parçala
    const { blogId } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);
    if (!isValidObjectId) {
      return res.render("./pages/404");
    }

    // Bloğun bulunamadığı durumu ele al
    const blogExists = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });
    if (!blogExists) {
      return res.render("./pages/404");
    }

    // Blog ayrıntılarını ele al ve sahip bilgilerini doldur
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto",
    });

    // Sahibinden daha fazla blog al
    const ownerBlogs = await Blog.find({ owner: { _id: blog.owner._id } }) // 'blog' nesnesini burada kullanıyoruz
      .select("title reaction totalBookmark owner readingTime createdAt")
      .populate({
        path: "owner",
        select: "name username profilePhoto",
      })
      .where("_id")
      .nin(blogId) // Düzeltildi
      .sort({ createdAt: "desc" }) // 'createAt' yerine 'createdAt'
      .limit(3); // Limit değeri verildi

    let user;
    if (req.session.user) {
      user = await User.findOne({ username: req.session.user.username }).select(
        "reactedBlogs readingList"
      );
    }

    res.render("./pages/blog_detail", {
      sessionUser: req.session.user,
      blog,
      ownerBlogs,
      user,
      markdown,
    });
  } catch (error) {
    console.error(
      "Blog ayrıntı sayfası oluşturulurken hata oluştu:",
      error.message
    );
  }
};

module.exports = renderBlogDetail; // Sadece fonksiyonu dışa aktar
