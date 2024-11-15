/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * node modüller
 */
const express = require("express");
require("dotenv").config();
const session = require("express-session"); // express-session kullanımı
const MongoStore = require("connect-mongo");

/**
 * özel modüller
 */
const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const { connectDB, disconnectDB } = require("./src/config/mongoose_config");
const home = require("./src/routes/home_route");
const createBlog = require("./src/routes/create_blog_route");
const logout = require("./src/routes/logout_route");
const userAuth = require("./src/middlewares/user_auth_middleware");
const blogDetail = require("./src/routes/blog_detail_route");
const readingList = require("./src/routes/reading_list_route");
const blogUpdate = require("./src/routes/blog_update_route");
const profile = require("./src/routes/profile_route");
const dashboard = require("./src/routes/dashboard_route");
const deleteBlog = require("./src/routes/blog_delete_route");
const settings = require("./src/routes/settings_route");
const categories = require("./src/routes/categories_route");
const currentnews = require("./src/routes/current_news_route"); // currentnews modülünü doğru şekilde ekledik

/**
 * ilk ekspres
 */
const app = express();

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
    store, // Doğru şekilde store kullanımı
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE),
    },
  })
);

/**
 * kayıt sayfası
 */
app.use("/register", register);

/**
 * giriş sayfası
 */
app.use("/login", login);

/**
 * Çıkış yap
 */
app.use("/logout", logout);

/**
 * Ana sayfa
 */
app.use("/", home);

/**
 *  Blog ayrıntı sayfası
 */
app.use("/blogs", blogDetail);

/**
 * Profil sayfası
 */

app.use("/profile", profile);
/**
 * kullanıcı yetkilendirmesi
 */
app.use(userAuth);

/**
 * Blog oluşturma sayfası
 */
app.use("/createblog", createBlog);

/**
 * Okuma listesi sayfası
 */
app.use("/readinglist", readingList);

/**
 * Blog güncelleme ve silme
 */
app.use("/blogs", blogUpdate, deleteBlog);

/**
 * Blog güncelleme
 */
app.use("/dashboard", dashboard);

/**
 * Kategori
 */
app.use("/categories", categories);

/**
 * Güncel Haberler
 */
app.use("/currentnews", currentnews);

/**
 * Blog güncelleme
 */
app.use("/settings", settings);

/**
 * başlama servisi
 */
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  console.log(`Servis Dinleme Portu http://localhost:${PORT}`); // Düzeltildi
  await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on("kapat", async () => await disconnectDB());
