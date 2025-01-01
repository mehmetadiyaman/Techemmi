/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("pages/contact", {
    title: "İletişim | EMMİ",
    route: "/contact"
  });
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Email gönderme işlemi için transporter oluştur
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email içeriği
    const mailOptions = {
      from: email,
      to: 'iletisimtechemmi@gmail.com',
      subject: `İletişim Formu: ${subject}`,
      html: `
        <h3>Yeni İletişim Mesajı</h3>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız." 
    });

  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin." 
    });
  }
});

module.exports = router; 