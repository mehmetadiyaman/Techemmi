/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * import module
 */

import Snackbar from "./snackbar.js";
// Fonksiyon: Göz simgesine tıklandığında şifreyi göster/gizle
const togglePasswordVisibility = (inputId, iconId) => {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId).querySelector("span");

  const isPasswordVisible = passwordInput.type === "text";
  passwordInput.type = isPasswordVisible ? "password" : "text"; // Şifreyi göster veya gizle
  eyeIcon.textContent = isPasswordVisible ? "visibility_off" : "visibility"; // Göz simgesini değiştir
};

// Fonksiyon: Göz simgesinin görünürlüğünü ayarla
const updateEyeIconVisibility = (inputId, iconId) => {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);

  // Input alanı odaklandığında göz simgesini göster
  eyeIcon.style.display =
    passwordInput.value !== "" || document.activeElement === passwordInput
      ? "block"
      : "none";
};

// Göz simgelerine tıklama ve görünürlük olay dinleyicilerini ekle
const addPasswordFieldListeners = (inputId, iconId) => {
  const eyeIcon = document.getElementById(iconId);
  const passwordInput = document.getElementById(inputId);

  // Tıklandığında şifre görünürlüğünü değiştir
  eyeIcon.addEventListener("click", () =>
    togglePasswordVisibility(inputId, iconId)
  );

  // Input alanına odaklanıldığında ve yazıldığında göz simgesini göster
  passwordInput.addEventListener("focus", () =>
    updateEyeIconVisibility(inputId, iconId)
  );
  passwordInput.addEventListener("input", () =>
    updateEyeIconVisibility(inputId, iconId)
  );

  // Input alanından çıkıldığında göz simgesinin görünürlüğünü kontrol et
  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value === "") {
      eyeIcon.style.display = "none"; // Göz simgesini gizle
    }
  });
};

// Göz simgeleri için olay dinleyicilerini ekle
addPasswordFieldListeners("password", "togglePassword");
addPasswordFieldListeners("confirm-password", "toggleConfirmPassword");

const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");

//kayıt formu göndrimini işlemek
$form.addEventListener("submit", async (event) => {
  //varsayılan form gönderim davranışını engelleme
  event.preventDefault();

  //birden fazla gönderim için button devre dışı bırakma

  $submitBtn.setAttribute("disabled", "");

  //form verilerini yakalamak için formdata nesnesi oluşturm
  const formData = new FormData($form);
  //şifre ve tekrarının eşleşmediği durumlarda
  if (formData.get("password") !== formData.get("confirm_password")) {
    //gönder butonu etkinleştir ve hatta mesajını göster
    $submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Lütfen aynı şifreyi girdiğinizden emin olun.",
    });
    return;
  }

  //sunucuya hesap oluşturma isteği gönder
  const response = await fetch(`${window.location.origin}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.fromEntries(formData.entries())
    ).toString(),
  });

  if (response.ok) {
    // Başarılı giriş Snackbar mesajını göster
    Snackbar({
      type: "success", // Başarı durumu için yeşil tarzı
      message: "Emmi'ye Hoşgeldin , içeride inovasyonun tadını çıkartın!",
    });

    // 1 saniye bekle, ardından yönlendirme yap
    setTimeout(() => {
      window.location = response.url;
    }, 2000); // 1 saniye gecikme ile yönlendirme
    return;
  }

  //Yanıt durumu 400 olanları elle al
  if (response.status == 400) {
    //gönder düğmesini etkinleştir ve hatta mesajını göster
    $submitBtn.removeAttribute("disabled");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
  }
});
