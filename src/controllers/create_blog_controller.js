/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * Node modüller
 */
const crypto = require("crypto");

/**
 * Özel modüller
 */
const uploadToCloudinary = require("../config/cloudinary_config");
const Blog = require("../models/blog_model");
const User = require("../models/user_model");
const getReadingTime = require("../utils/get_reading_time_utils");

/**
 * Blog oluşturma sayfasını getir
 * @param {object} req
 * @param {object} res
 */
const renderCreateBlog = (req, res) => {
  res.render("./pages/create_blog", {
    sessionUser: req.session.user,
    route: req.originalUrl,
  });
};

const postCreateBlog = async (req, res) => {
  try {
    // İstek gövdesinden başlığı ve içeriği al
    const { banner, title, content } = req.body;

    // Blog içeriğini Cloudinary'ye yükleme
    const public_id = crypto.randomBytes(10).toString("hex");
    const bannerURL = await uploadToCloudinary(banner, public_id);

    // Blog yazısını oluşturan kullanıcıyı bul
    const user = await User.findOne({
      username: req.session.user.username,
    }).select("_id blogs blogPublished");

    // Yeni blog post oluşturma
    const newBlog = await Blog.create({
      banner: {
        url: bannerURL,
        public_id,
      },
      title,
      content,
      owner: user._id,
      readingTime: getReadingTime(content),
    });

    // Kullanıcının blog vektörlerini güncelleme
    user.blogs.push(newBlog._id);
    user.blogPublished++;
    await user.save();

    // Yeni oluşturulan blog yazısı sayfasına yönlendir
    res.redirect(`blogs/${newBlog._id}`);
  } catch (error) {
    // Herhangi bir hata oluştuğunda log tut ve istemciye hata yanıtı gönder
    console.error("Blog oluşturulurken bir hata oluştu:", error.message);
    res.status(500).render("error", {
      message:
        "Blog oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.",
    });
  }
};

module.exports = { renderCreateBlog, postCreateBlog };
