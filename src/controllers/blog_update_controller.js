/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * özel modüller
 */
const Blog = require("../models/blog_model");
const uploadToCloudinary = require("../config/cloudinary_config");

/**
 * Bir kullanıcı için oturum açma sürecini yönetme
 * @param {object} req
 * @param {object} res
 * @throws {error}
 */
const renderBlogEdit = async (req, res) => {
  try {
    //BlogId istek parametresinden al
    const { blogId } = req.params;
    //Oturumdan kayıtlı istemcinin kullanıcı adını al
    const { username } = req.session.user;
    //Düzenlenecek blog kullanıcısın kimliğine göre  bulma
    const currentBlog = await Blog.findById(blogId)
      .select("banner title content owner")
      .populate({ path: "owner", select: "username" });
    //mevcut kullanıcının diğer kullanıcıların blogunu düzenlemeye kalktığı durumu ele al
    if (currentBlog.owner.username !== username) {
      return res
        .status(403)
        .send(
          "<h2>Üzgünüm,Yazarı olmadığınız bu paylaşımı düzenlemeye yetkiniz yok.</h2>"
        );
    }
    res.render("./pages/blog_update", {
      sessionUser: req.session.user,
      currentBlog,
    });
  } catch (error) {
    console.error(
      "Blog düzenleme sayfası getirilirken bir hatta oluştu",
      error.message
    );
    throw error;
  }
};
/**
 * Bir kullanıcı için oturum açma sürecini yönetme
 * @param {object} req
 * @param {object} res
 * @throws {error}
 */
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content, banner } = req.body;

    const updateBlog = await Blog.findById(blogId).select(
      "banner title content"
    );

    if (banner) {
      try {
        const bannerURL = await uploadToCloudinary(
          banner,
          updateBlog.banner.public_id
        );
        updateBlog.banner.url = bannerURL;
      } catch (error) {
        console.error("Cloudinary yükleme hatası:", error.message);
        return res.status(400).send("Görsel yükleme başarısız.");
      }
    }

    updateBlog.title = title;
    updateBlog.content = content;
    await updateBlog.save();
    return res.status(200).send("Blog güncellendi.");
  } catch (error) {
    console.error("Blog güncelleme sırasındaki hata:", error.message);
    return res.status(500).send("Blog güncelleme başarısız.");
  }
};

module.exports = {
  renderBlogEdit,
  updateBlog,
};
