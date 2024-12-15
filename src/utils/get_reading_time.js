/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const AVG_READ_WPM = 200;

/**
 * Belirli bir metin için okuma süresi hesaplar
 * @param {string} text
 * @returns {number}
 */
const getReadingTime = (text) =>
  Math.ceil(text.split(" ").length / AVG_READ_WPM);

module.exports = getReadingTime; // CommonJS modül kullanımı
