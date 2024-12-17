/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modülleri
 */
const bcrypt = require("bcryptjs");

/**
 * Özel modüller
 */
const User = require("../models/user_model");
const genarateUsername = require("../utils/genarate_username_util");
/**
 *kayıt sayfasını işleme alınır
 * @param {object} req
 * @param {object} res
 */

const renderRegister = (req, res) => {
  const { userAuthenticated } = req.session.user || {};
  //kullanıcının zaten oturum açtığı durumu ele al
  if (userAuthenticated) {
    return res.redirect("./");
  }
  res.render("./pages/register");
};

/**
 *kullanıcı kaydı için form kaydını yönetir
 * @param {object} req
 * @param {object} res
 */

const postRegister = async (req, res) => {
  try {
    //kullanıcı veri formunu çıkartma
    const { name, email, password } = req.body;

    //isim ekleme
    const username = genarateUsername(name);

    //şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    //sağlanan verilerle kullanıcı oluştur
    await User.create({ name, email, password: hashedPassword, username });

    //başarılı kayıt sonrası kullanıcıyı oturum açmaya yönlendir
    res.redirect("/login");
  } catch (error) {
    if (error.code == 11000) {
      if (error.keyPattern.email) {
        return res.status(400).send({
          message: "Bu e-posta adresi daha önce bir hesapla ilişkilendirilmiş",
        });
      }
      if (error.keyPattern.username) {
        return res
          .status(400)
          .send({ message: "Bu kullanıcı adı zaten kullanımda" });
      }
    } else {
      return res
        .status(400)
        .send({ message: `kayıt başarısız oldu.<br>${error.message}` }); // backtick (`) kullanıldı
    }

    console.log("postRegister: ", error.message);
    throw error;
  }
};

module.exports = {
  renderRegister,
  postRegister,
};
