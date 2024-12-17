/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

import imagePreview from "./utils/imagePreview.js";
import Snackbar from "./snackbar.js";
import config from "./config.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";

// Görüntü alanı, önizleme ve önizlemeyi temizle düğmesi
const $imageField = document.querySelector("[data-image-field]");
const $imagePreview = document.querySelector("[data-image-preview]");
const $imagePreviewClear = document.querySelector("[data-image-preview-clear]");

$imageField.addEventListener("change", () => {
  imagePreview($imageField, $imagePreview);
});

/**
 * Görüntü önizlemesini temizler
 * @function clearImagePreview
 */
const clearImagePreview = function () {
  $imagePreview.classList.remove("show");
  $imagePreview.innerHTML = "";
};

$imagePreviewClear.addEventListener("click", clearImagePreview);

//Blog yayınlama
const $form = document.querySelector("[data-form]");
const $publishBtn = document.querySelector("[data-publish-btn]");
const $progressBar = document.querySelector("[data-progress-bar]");

const handlePublishBlog = async function (event) {
  // Default form gönderme davranışı önlenir.
  event.preventDefault();

  // Birden fazla gönderimi engellemek için yayınla butonu devre dışı bırakıldı
  $publishBtn.setAttribute("disabled", "true");

  // Form verilerini yakalamak için FormData nesnesi oluşturuluyor.
  const formData = new FormData($form);

  // Blog oluştururken kullanıcı banner için herhangi bir resim seçme durumu ele alındı.
  if (!formData.get("banner").size) {
    // Yayınla butonunu etkinleştir
    $publishBtn.removeAttribute("disabled");
    Snackbar({ type: "error", message: "Lütfen blog için bir resim seçin." });
    return;
  }

  // Seçilen resim boyutunun 5MB'tan büyük olduğu durumlar
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    // Yayınla butonunu etkinleştir
    $publishBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Resim boyutu 5MB'tan küçük olmalıdır.",
    });
    return;
  }

  // Banner değerini base 64 olarak dönüştürme
  formData.set("banner", await imageAsDataURL(formData.get("banner")));

  // İstek için formData'dan nesne oluşturma
  const body = Object.fromEntries(formData.entries());

  // İlerleme çubuğunu göster
  $progressBar.classList.add("loading");

  // Blog oluşturmak için form verilerini sunucuya gönderme
  const response = await fetch(`${window.location.origin}/createblog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Yanıtın başarılı olduğu durumu ele alma
  if (response.ok) {
    Snackbar({ message: "Blog başarıyla oluşturuldu.", type: "success" });

    $progressBar.classList.add("loading-end");

    // 3 saniye bekleyip response.url'e yönlendir
    setTimeout(() => {
      window.location = response.url; // response.url'e yönlendir
    }, 1000); // 3 saniye bekleme
  }

  // 400 dönen istekler
  if (response.status === 400) {
    $publishBtn.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    const { message } = await response.json();
    Snackbar({ type: "error", message });
  }
};

$form.addEventListener("submit", handlePublishBlog);
