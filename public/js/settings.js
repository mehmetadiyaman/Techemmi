/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * import modüller
 */

import Snackbar from "./snackbar.js";
import { Modal } from "./snackbar.js"; // Modal'ı import et
import imagePreview from "./utils/imagePreview.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";
import config from "./config.js";

/**
 * özel modüller
 */

//Görüntü alanı ve tamizliyicileri
const $imageField = document.querySelector("[data-image-field]");
const $imagePreview = document.querySelector("[data-image-preview]");
const $imagePreviewClear = document.querySelector("[data-image-preview-clear]");

// Fonksiyon: Göz simgesine tıklandığında şifreyi göster/gizle
const togglePasswordVisibility = (inputId, icon) => {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = icon.querySelector("span");

  const isPasswordVisible = passwordInput.type === "text";
  passwordInput.type = isPasswordVisible ? "password" : "text"; // Şifreyi göster veya gizle
  eyeIcon.textContent = isPasswordVisible ? "visibility_off" : "visibility"; // Göz simgesini değiştir
};

// Fonksiyon: Göz simgesinin görünürlüğünü ayarla
const toggleEyeIconVisibility = (inputId, iconId) => {
  const inputElement = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);

  const isInputFocused =
    document.activeElement === inputElement || inputElement.value !== "";
  eyeIcon.style.display = isInputFocused ? "block" : "none"; // Göz simgesini göster veya gizle
};

// Göz simgeleri için olay dinleyicileri
const addEyeToggleListeners = (inputId, iconId) => {
  const eyeIcon = document.getElementById(iconId);

  // Tıklandığında şifre görünürlüğünü değiştir
  eyeIcon.addEventListener("click", () =>
    togglePasswordVisibility(inputId, eyeIcon)
  );

  // Input alanına odaklanıldığında göz simgesini göster
  const inputElement = document.getElementById(inputId);
  inputElement.addEventListener("focus", () =>
    toggleEyeIconVisibility(inputId, iconId)
  );
  inputElement.addEventListener("input", () =>
    toggleEyeIconVisibility(inputId, iconId)
  );
  inputElement.addEventListener("blur", () =>
    toggleEyeIconVisibility(inputId, iconId)
  );
};

// Göz simgeleri için olay dinleyicilerini ekle
addEyeToggleListeners("old-password", "toggleOldPassword");
addEyeToggleListeners("new-password", "toggleNewPassword");
addEyeToggleListeners("confirm-password", "toggleConfirmPassword");

//profil foto yükleme
$imageField.addEventListener("change", () => {
  imagePreview($imageField, $imagePreview);
});

//profil foto silme
const clearImagePreview = function () {
  $imagePreview.classList.remove("show");
  $imagePreview.innerHTML = "";
  $imageField.value = "";
};
$imagePreviewClear.addEventListener("click", clearImagePreview);

//Temel bilgiler kısmı
const $basicInfoForm = document.querySelector("[data-basic-info-form]");
const $basicInfoSubmit = document.querySelector("[data-basic-info-submit]");
const oldFormData = new FormData($basicInfoForm);
const $progressBar = document.querySelector("[data-progress-bar]");

/**
 * Temel bilgileri güncelleme
 * @param {Event} event
 */

const updateBasicInfo = async (event) => {
  event.preventDefault();

  $basicInfoSubmit.setAttribute("disabled", "");

  const formData = new FormData($basicInfoForm);

  //görsel boyutunu max 1mb olarak ayarla
  if (formData.get("profilePhoto").size > config.profilePhoto.maxByteSize) {
    $basicInfoSubmit.removeAttribute("disabled");

    Snackbar({
      type: "error",
      message: "Profil fotoğrafını en fazla 1MB boyutunda seçmelisiniz.",
    });
    return;
  }
  //Kulanıcın herhangi bir profil seçmediği durumu el al
  if (!formData.get("profilePhoto").size) {
    formData.delete("profilePhoto");
  }
  if (formData.get("profilePhoto")) {
    //base64 ile çevirme
    formData.set("profilePhoto", await imageAsDataURL($imageField.files[0]));
  }

  if (formData.get("username") == oldFormData.get("username")) {
    formData.delete("username");
  }

  if (formData.get("email") == oldFormData.get("email")) {
    formData.delete("email");
  }

  const body = Object.fromEntries(formData.entries());
  $progressBar.classList.add("loading");
  const response = await fetch(`${window.location.href}/basic_info`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    $basicInfoSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({ message: "Profiliniz güncellendi", type: "success" }); // snackbar-success sınıfı için type ekledik
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 saniye bekle
  }

  //400 durumunu ele al
  if (response.status == 400) {
    $basicInfoForm.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
  }
};
$basicInfoForm.addEventListener("submit", updateBasicInfo);

//Şifre işlemleri

const $passwordForm = document.querySelector("[data-password-form]");
const $passwordSubmit = document.querySelector("[data-password-submit]");

const updatePassword = async (event) => {
  event.preventDefault();

  $passwordSubmit.setAttribute("disabled", ""); // Submit butonunu devre dışı bırak

  const formData = new FormData($passwordForm);

  // Şifre doğrulama
  if (formData.get("password") !== formData.get("confirm_password")) {
    $passwordSubmit.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Lütfen aynı şifreyi girdiğinizden emin olun.",
    });
    return;
  }

  const body = Object.fromEntries(formData.entries());

  $progressBar.classList.add("loading");

  // İlk olarak eski şifreyi kontrol et
  const oldPasswordResponse = await fetch(
    `${window.location.href}/check-old-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword: formData.get("old_password") }),
    }
  );

  // Eski şifre hatalıysa hata mesajı göster
  if (oldPasswordResponse.status === 401) {
    $passwordSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({
      type: "error",
      message: "Eski şifrenizi yanlış girdiniz.",
    });
    return;
  }

  // Eski şifre doğruysa şifre güncelleme isteği
  const response = await fetch(`${window.location.href}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    $passwordSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    Snackbar({
      message: "Şifre değiştirme işlemi başarılı",
      type: "success",
    });

    // Sayfa yenile
    setTimeout(() => {
      window.location.reload(); // Sayfayı yenile
    }, 1000); // 1 saniye beklemeden sonra yenile
    return;
  }

  // 400 durumu (örneğin, eksik alanlar)
  if (response.status == 400) {
    $passwordSubmit.removeAttribute("disabled");
    $progressBar.classList.add("loading-end");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
    return;
  }
};

$passwordForm.addEventListener("submit", updatePassword);

/**
 * Hesabı silme
 */
const $accountDeleteBtn = document.querySelector("[data-account-delete]");
const deleteAccount = () => {
  // Modal'ı oluştur ve göster
  Modal({
    message: "Hesabınızı silmek istediğinize emin misiniz?",
    onConfirm: async () => {
      $accountDeleteBtn.setAttribute("disabled", "");
      $progressBar.classList.add("loading");

      const response = await fetch(`${window.location.href}/account`, {
        method: "DELETE",
      });

      if (response.ok) {
        $progressBar.classList.add("loading-end"); // Yükleme durumu güncelleniyor
        Snackbar({ message: "Hesabınız başarıyla silindi.", type: "success" });

        // 3 saniye bekleyip anasayfaya yönlendir
        setTimeout(() => {
          window.location = `${window.location.origin}/`;
        }, 1000); // 3 saniye bekleme
      }
    },
    onCancel: () => {
      // Modal kapandığında yapılacak işlem
      console.log("Hesap silme işlemi iptal edildi.");
    },
  });
};

$accountDeleteBtn.addEventListener("click", deleteAccount);
