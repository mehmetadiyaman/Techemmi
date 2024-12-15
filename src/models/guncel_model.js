// models/guncel_model.js

"use strict";

const mongoose = require("mongoose");

const guncelSchema = new mongoose.Schema({
  title: String,
  link: String,
  published: String,
  summary: String,
});

module.exports = mongoose.model("Guncel", guncelSchema, "guncel");
