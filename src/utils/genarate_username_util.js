/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * Özel modüller
 */

/**
 * Sağlanan isme göre bir kullanıcı adı oluşturma
 * @param {String} name
 * @returns {String}
 */

module.exports = (name) => {
  const username = name.toLocaleLowerCase().replace(" ", ""); // Düzgün tanımlama
  return `${username}-${Date.now()}`; // Düzgün string interpolasyonu
};
