/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * node modüller
 */
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

/**
 * ilk ekspres
 */

const app = express(); // Express uygulamasını önce oluştur

/**
 * özel modüller
 */

const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const logout = require('./src/routes/logout_route');
const blogdetail = require('./src/routes/blog_detail_route');

const { connectDB, disconnectDB } = require("./src/config/mongoose_config");
const home = require("./src/routes/home_route");
const createBlog = require("./src/routes/create_blog_route");

/**
 * görünüm kısmını ayarla
 */

app.set("view engine", "ejs");

/**
 * public dizini ayarla
 */

app.use(express.static(__dirname + "/public"));

/**
 * gövdeyi urlencoded ile ayrıştır
 */

app.use(express.urlencoded({ extended: true }));

/**
 * json gövdelerini ayrıştır
 */

app.use(express.json({ limit: "10mb" }));

/**
 * sessions depolanması
 */

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_CONNECTION_URI,
  collectionName: "sessions",
  dbName: "Emmi",
});

/**
 * express sessions
 */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE),
    },
  })
);

// Route'ları ekle

app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/", home);
app.use("/blogs", blogdetail);

/**
 * başlama servisi
 */

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  console.log(`Servis Dinleme Portu http://localhost:${PORT}`);
  await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on("kapat", async () => await disconnectDB());
