const nodemailer = require('nodemailer');
require('dotenv').config(); // .env dosyasını yükle

// SMTP transporter oluşturma
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS kullanılacak
  auth: {
    user: process.env.EMAIL_USER, // .env dosyasından çekiliyor
    pass: process.env.EMAIL_PASS, // .env dosyasından çekiliyor
  },
});

// E-posta gönderim fonksiyonu
const sendEmail = async (to, subject, text) => {
  try {
    // Parametre kontrolü
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new Error('Geçerli bir alıcı e-posta adresi girilmedi.');
    }

    let info = await transporter.sendMail({
      from: `"Emmi Projesi" <${process.env.EMAIL_USER}>`, // Gönderen adı ve e-posta
      to, // Alıcı
      subject, // Konu
      text, // Mesaj
    });

    console.log('E-posta gönderildi:', info.messageId);
  } catch (error) {
    console.error('E-posta gönderim hatası:', error.message);
    throw error; // Hatanın üst katmanlara iletilmesi
  }
};

module.exports = {
  sendEmail,
};
