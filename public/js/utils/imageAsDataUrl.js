/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * Verilen bir görüntü bloğunu URL dönüştürme
 * @param {Blob} imageBlob
 * @returns {Promise<string>}
 */
const imageAsDataURL = (imageBlob) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(imageBlob);
  return new Promise((resolve, reject) => {
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });
    fileReader.addEventListener("error", () => {
      reject(fileReader.error);
    });
  });
};
export default imageAsDataURL;
