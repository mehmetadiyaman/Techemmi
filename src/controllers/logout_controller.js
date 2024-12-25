/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * @param {object} req
 * @param {object} res
 */
const logout = async (req, res) => {
  try {
    // Kullanıcı oturumunu sil
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.error("Çıkış yaparken bir hata oluştu:", error.message);
    return res.status(500).send("Çıkış işlemi sırasında hata oluştu."); // Hata durumunda uygun bir yanıt döndür
  }
};

module.exports = logout;
