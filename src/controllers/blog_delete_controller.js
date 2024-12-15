/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * özel modüller
 */
const Blog = require("../models/blog_model");
const User = require("../models/user_model");

/**
 * @param {object} req
 * @param {object} res
 * @throws {Error}
 */

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { username } = req.session.user;

    //Bul ve sil
    const deletedBlog = await Blog.findOne({ _id: blogId }).select(
      "reaction totalVisit"
    );
    const currentUser = await User.findOne({ username }).select(
      "blogPublished totalVisits totalReactions blogs"
    );

    //Kullanıcıya före veritabanındaki bilgileri güncelle
    currentUser.blogPublished--;
    currentUser.totalVisits -= deletedBlog.totalVisit;
    currentUser.totalReactions -= deletedBlog.reaction;
    currentUser.blogs.splice(currentUser.blogs.indexOf(blogId), 1);
    await currentUser.save();

    //Blogu veritabanından da silme

    await Blog.deleteOne({ _id: blogId });
    res.sendStatus(200);
  } catch (error) {
    console.error("Blog silinirken bir hatta oluştu", error.message);
    throw error;
  }
};

module.exports = deleteBlog;
