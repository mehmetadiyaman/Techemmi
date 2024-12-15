/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * @param {HTMLInputElement} $imageField
 * @param {HTMLElement} $previewElement
 * @returns {Promise<string>}
 */

const imagePreview = async function ($imageField, $previewElement) {
  
  const imageObjectUrl = URL.createObjectURL($imageField.files[0]);
  
  // Resmi önizleme alanına atama gibi işlemleri burada yapabilirsiniz.
  const $image = document.createElement('img');
  $image.classList.add('img-cover');
  $image.src = imageObjectUrl;

  $previewElement.append($image); 
  $previewElement.classList.add('show');
  
  return imageObjectUrl;


};

export default imagePreview;
