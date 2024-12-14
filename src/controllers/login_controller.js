/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modüller
 */

const bcrypt = require("bcrypt");

/**
 * özel modüller
 */
const User = require("../models/user_model");

const { render } = require("ejs");

/**
 * Giriş sayfasını göster
 * @param {object} req
 * @param {object} res
 */

const renderLogin = (req, res) => {
  const { userAuthenticated } = req.session.user || {};
  //kullanıcının zaten oturum açtığı durumu ele al
  if (userAuthenticated) {
    return res.redirect("./");
  }
  res.render("./pages/login");
};

/**
 * Bir kullanıcı için oturum açma sürecini yönetme
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
const postLogin = async (req, res) => {
  try {
    // İstek gövdesinden e-posta ve şifreyi çıkart
    const { email, password } = req.body;

    // E-posta ile veritabanından kullanıcı bulma
    const currentUser = await User.findOne({ email });

    // E-postayla hiçbir kullanıcı bulunmadığı durumunu ele al
    if (!currentUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresine sahip kullanıcı bulunamadı" });
    }

    // Şifrenin geçerli olup olmadığını kontrol et
    const passwordIsValid = await bcrypt.compare(
      password,
      currentUser.password
    );

    // Şifrenin geçersiz olduğu durumu ele al
    if (!passwordIsValid) {
      return res.status(400).json({
        message:
          "Geçersiz şifre. Lütfen doğru şifreyi girdiğinizden emin olun ve tekrar deneyin.",
      });
    }

    // Oturum kullanıcısının kimliğini doğru olarak ayarla ve ana sayfaya yönlendir
    req.session.user = {
      userAuthenticated: true,
      name: currentUser.name,
      username: currentUser.username,
      profilePhoto: currentUser.profilePhoto?.url,
    };

    // Başarıyla giriş yaptıktan sonra ana sayfaya yönlendirin
    res.status(200).json({ message: "Giriş başarılı" });
  } catch (error) {
    console.log("postLogin", error.message);
    throw error;
  }
};

module.exports = {
  renderLogin,
  postLogin,
};
