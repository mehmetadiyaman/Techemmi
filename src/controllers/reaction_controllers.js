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

/**
 * Tepi sayısı güncelleme ve bunları kullanıcı ile ilişkilendirme
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */
const updateReaction = async (req, res) => {
  try {
    //kullanıcının kimlik doğrulamadığı işlemi elle al
    if (!req.session.user) return res.sendStatus(401);

    //Kullanıcı ismini oturumdan ayır
    const { username } = req.session.user;
    const { blogId } = req.params;

    //Kullanıcının bloğa zaten tepki verdiği durumu ele al
    const currentUser = await User.findOne({ username }).select("reactedBlogs");
    if (currentUser.reactedBlogs.includes(blogId)) {
      return res.sendStatus(400);
    }
    //Bloğu bul ve tepki sayısını güncelle
    const reactedBlog = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({ path: "owner", select: "totalReactions" });
    reactedBlog.reaction++;
    await reactedBlog.save();

    //Güncelleme ve kaydetme işelmi
    currentUser.reactedBlogs.push(reactedBlog._id);
    await currentUser.save();
    reactedBlog.owner.totalReactions++;
    await reactedBlog.owner.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Reaksiyon güncellenirken bir hatta oluştu", error.message);
    throw error;
  }
};

/**
 * Silme işlemi için
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */
const deleteReaction = async (req, res) => {
  try {
    //kullanıcının kimlik doğrulamadığı işlemi elle al
    if (!req.session.user) return res.sendStatus(401);

    //Kullanıcı ismini oturumdan ayır
    const { username } = req.session.user;
    const { blogId } = req.params;

    //Kullanıcının bloğa zaten tepki vermediği durumu ele al
    const currentUser = await User.findOne({ username }).select("reactedBlogs");
    if (!currentUser.reactedBlogs.includes(blogId)) {
      return res.sendStatus(400);
    }
    //Bloğu bul ve tepki sayısını güncelle
    const reactedBlog = await Blog.findById(blogId)
      .select("reaction owner")
      .populate({ path: "owner", select: "totalReactions" });
    reactedBlog.reaction--;
    await reactedBlog.save();

    //Güncelleme ve kaydetme işelmi
    currentUser.reactedBlogs.splice(
      currentUser.reactedBlogs.indexOf(blogId),
      1
    );
    await currentUser.save();
    reactedBlog.owner.totalReactions--;
    await reactedBlog.owner.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Reaksiyon silinirken bir hatta oluştu", error.message);
    throw error;
  }
};

module.exports = {
  updateReaction,
  deleteReaction,
};
