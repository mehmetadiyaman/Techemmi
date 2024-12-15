/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * node modülleri
 */
//cloudinary kütüphaneleri
const cloudinary = require("cloudinary").v2;

/**
 * cloudinary dosya yükleme ayarı
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Base 64 ile olan fotoğrafları cloudinary yükleme
 *@param {String} image
 *@param {String} public_id
 *@returns {Promise<string>}
 * @throws {Error}
 */

const uploadToCloudinary = async (image, public_id) => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      public_id,
    });
    return response.secure_url;
  } catch (error) {
    console.error(
      "Görsel Cloudinary yüklenirken bir sorun oluştu :",
      error.message
    );
    throw error;
  }
};
module.exports = uploadToCloudinary;
