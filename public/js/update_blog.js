/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * modüller
 */
import Snackbar from "./snackbar.js";
import imagePreview from "./utils/imagePreview.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";
import config from "./config.js";

// Görüntü alanı, önizleme ve önizlemeyi temizle düğmesi
const $imageField = document.querySelector("[data-image-field]");
const $imagePreview = document.querySelector("[data-image-preview]"); // Değişken adı değiştirildi
const $imagePreviewClear = document.querySelector("[data-image-preview-clear]");

$imageField.addEventListener("change", () => {
  imagePreview($imageField, $imagePreview); // Yeni isimle çağırılıyor
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

//Blog düzenleme
const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");
const $progressBar = document.querySelector("[data-progress-bar]");
const handleBlogUpdate = async (event) => {
  //Varsayılan form gönderim davranışını engelleme
  event.preventDefault();
  //Birden fazla gönderim için butonu devre dışı bırak
  $submitBtn.setAttribute("disabled", "");

  //Form verileri yakalamak için formData nesnesi oluşturma
  const formData = new FormData($form);

  //Blog güncellenirken kullanıcının herhangi bir resmi seçmediği durumu ele al
  if (!formData.get("banner").size && !$imagePreview.hasChildNodes()) {
    //Yayınla butonunu etkinleştir
    $submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Lütfen resim alanını boş bırakmayınız",
    });
    return;
  }
  //Seçilen resim boyutunun 5MB'tan büyük oldupu durumlar
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    //Yayınla butonunu etkinleştir
    $submitBtn.removeAttribute("disabled");
    Snackbar({ type: "error", message: "Resim 5MB'tan küçük olmalıdır." });
    return;
  }
  //Kullanıcı blog başlığını güncellemediği durumu ele al
  if (!formData.get("banner").size && $imagePreview.hasChildNodes()) {
    formData.delete("banner");
  }
  //Kullanıcı blog başlığını güncellemediği durumu ele al
  if (formData.get("banner")) {
    formData.set("banner", await imageAsDataURL(formData.get("banner")));
  }
  //formData gövdesinden istek oluştur
  const body = Object.fromEntries(formData.entries());
  $progressBar.classList.add("loading");

  //Form verilerini sunucu tarafında güncelleme
  const response = await fetch(window.location.href, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  //Başarılı olduğu durumu ele al
  if (response.ok) {
    $submitBtn.removeAttribute("disabled");
    Snackbar({ message: "Blogunuz güncellendi", type: "success" });
    $progressBar.classList.add("loading-end");
    window.location = window.location.href.replace("/edit", "");
    return;
  }

  //400 durumunu ele al
  if (response.status == 400) {
    $progressBar.classList.add("loading-end");
    $submitBtn.removeAttribute("disabled");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
  }
};
$form.addEventListener("submit", handleBlogUpdate);
