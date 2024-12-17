/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modüller
 */
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
/**
 * özel modüller
 */
const User = require("../models/user_model");
const Blog = require("../models/blog_model");
const uploadToCloudinary = require("../config/cloudinary_config");

/**
 * @async
 * @function renderSettings
 * @param {Object} req
 * @param {Object} res
 * @throws {Error}
 */
const renderSettings = async (req, res) => {
  try {
    const { username } = req.session.user;
    const currentUser = await User.findOne({ username });

    //Ayarlar sayfasını işle
    res.render("./pages/settings", {
      sessionUser: req.session.user,
      currentUser,
    });
  } catch (error) {
    console.error("Ayarlar sayfasında bir hatta oluştu", error.message);
    throw error;
  }
};

/**
 * @async
 * @param {Object} req
 * @param {Object} res
 * @throws {Error}
 */

const updateBasicInfo = async (req, res) => {
  try {
    const { username: sessionUsername } = req.session.user;

    //Oturum kullanıcı adına göre geçerli kullanıcıyı al
    const currentUser = await User.findOne({
      username: sessionUsername,
    }).select("profilePhoto name username email bio");

    //istekten özellikleri pars et
    const { profilePhoto, name, username, email, bio } = req.body;

    //Yeni email hesabı başka bir hesapla  ilişkili olduğu durumu ele al,
    if (email) {
      if (await User.exists({ email })) {
        return res.status(400).json({
          message:
            "Üzgünüm , bu e-posta hesabı daha önce bir hesapla ilişkilendirilmiş",
        });
      }
      currentUser.email = email;
    }
    //Aynı kullanıcı adı durumunu ele al
    if (username) {
      if (await User.exists({ username })) {
        return res.status(400).json({
          message:
            "Üzgünüm , bu kullanıcı adı daha önce alınmış lütfen farklı bir tane seçin",
        });
      }
      currentUser.username = username;
      req.session.user.username = username;
    }

    //Profil fotoğrafını icloudinary yükleme durumu
    if (profilePhoto) {
      const public_id = currentUser.username;
      const imageURL = await uploadToCloudinary(profilePhoto, public_id);
      currentUser.profilePhoto = {
        url: imageURL,
        public_id,
      };
      req.session.user.profilePhoto = imageURL;
    }
    //Geçerli kullanıcının adını ve biyografisini güncelle
    currentUser.name = name;
    req.session.user.name = name;
    currentUser.bio = bio;
    //veritabanı kısmında güncelleme
    await currentUser.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Kullanıcı Bilgileri işlenirken hatta oluştu", error.message);
    throw error;
  }
};

/**
 * @async
 * @param {Object} req
 * @param {Object} res
 * @throws {Error}
 */

const updatePassword = async (req, res) => {
  try {
    const { username: sessionUsername } = req.session.user;

    const currentUser = await User.findOne({
      username: sessionUsername,
    }).select("password");
    const { old_password, password } = req.body;

    //Eski şifreyi doğrula
    const oldPasswordIsValid = await bcrypt.compare(
      old_password,
      currentUser.password
    );

    //Eski şifre doğru değil ise
    if (!oldPasswordIsValid) {
      return res.status(400).json({ message: "Lütfen doğru şifrenizi girin." });
    }
    //yeni şifre hashleme
    const newPassword = await bcrypt.hash(password, 10);
    currentUser.password = newPassword;
    await currentUser.save();
    res.sendStatus(200);
  } catch (error) {
    console.error(
      "Şifre güncelleme  işlemi sırasında bir hatta oluştu",
      error.message
    );
    throw error;
  }
};

/**
 * @async
 * @param {Object} req
 * @param {Object} res
 * @throws {Error}
 */

const deleteAccount = async (req, res) => {
  try {
    const { username } = req.session.user;
    const currentUser = await User.findOne({ username }).select("blogs");
    await Blog.deleteMany({ _id: { $in: currentUser.blogs } });
    await User.deleteOne({ username });
    const Session = mongoose.connection.db.collection("sessions");
    await Session.deleteMany({ session: { $regex: username, $options: "i" } });
    req.session.destroy();
    res.sendStatus(200);
  } catch (error) {
    console.log("Hesap silinirken bir hatta oluştu", error.message);
    throw error;
  }
};

module.exports = {
  renderSettings,
  updateBasicInfo,
  updatePassword,
  deleteAccount,
};
