/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const contactValidator = {
  validateContactForm: (req, res, next) => {
    const { name, email, subject, message } = req.body;

    // Basit validasyon kontrolleri
    if (!name || name.length < 2 || name.length > 50) {
      return res.status(400).json({
        message: "Ad alanı 2-50 karakter arasında olmalıdır."
      });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        message: "Geçerli bir e-posta adresi giriniz."
      });
    }

    if (!subject || subject.length < 3 || subject.length > 100) {
      return res.status(400).json({
        message: "Konu alanı 3-100 karakter arasında olmalıdır."
      });
    }

    if (!message || message.length < 10 || message.length > 500) {
      return res.status(400).json({
        message: "Mesaj alanı 10-500 karakter arasında olmalıdır."
      });
    }

    next();
  }
};

module.exports = contactValidator; 