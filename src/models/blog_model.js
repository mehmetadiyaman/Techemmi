/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modüller
 */
const mongoose = require("mongoose");

/**
 * Blog için mongodb şeması
 */
const blogSchema = new mongoose.Schema(
  {
    banner: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    reaction: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    totalBookmark: {
      type: Number,
      default: 0,
    },
    totalVisit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
