/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const Contact = require("../models/contact_model");
const { sendEmail } = require("../utils/emailService");

console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

const contactController = {
  // İletişim sayfasını göster
  getContactPage: (req, res) => {
    const message = req.session.message;
    // Session mesajını sil
    delete req.session.message;
    
    res.render("pages/contact", {
      user: req.session.user || null,
      message: message
    });
  },

  // İletişim formunu işle
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Veritabanına kaydet
      await Contact.create({
        name,
        email,
        subject,
        message
      });

      // E-posta gönder
      const emailText = `
        Yeni İletişim Formu Mesajı
        
        Gönderen: ${name}
        E-posta: ${email}
        Konu: ${subject}
        
        Mesaj:
        ${message}
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL,
        `Yeni İletişim Mesajı: ${subject}`,
        emailText
      );

      req.session.message = {
        type: "success",
        text: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."
      };
      
    } catch (error) {
      req.session.message = {
        type: "error",
        text: "Mesajınız gönderilemedi. Lütfen tekrar deneyiniz."
      };
      console.error("İletişim formu hatası:", error);
    }
    
    res.redirect("/contact");
  }
};

module.exports = contactController;
