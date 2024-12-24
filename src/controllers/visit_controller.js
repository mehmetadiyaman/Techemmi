/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * özel modüller
 */
const Blog = require("../models/blog_model");

const updateVisit = async (req, res) => {
  try {
    //İstek parametreleriinden blogId silme
    const { blogId } = req.params;

    //Blogu bul ve total visitlerin sayısını güncele
    const visitedBlog = await Blog.findById(blogId)
      .select("totalVisit owner")
      .populate({ path: "owner", select: "totalVisits" });
    visitedBlog.totalVisit++;
    await visitedBlog.save();

    //Sayıları Güncelle
    visitedBlog.owner.totalVisits++;
    await visitedBlog.owner.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Toplam ziyaret edilenlerde bir hatta oluştu", error.message);
    throw error;
  }
};
module.exports = updateVisit;
