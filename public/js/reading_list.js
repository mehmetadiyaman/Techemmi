/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * özel modüller
 */
import dialog from "./dialog.js";

//Okuma kısmı buttonları
const $readingListBtn = document.querySelector("[data-reading-list-btn]");
const $readingListNumber = document.querySelector("[data-reading-list-number]");

const addToReadingList = async () => {
  try {
    //Okuma listesine göre bir put isteği gönder
    const response = await fetch(`${window.location}/readingList`, {
      method: "PUT",
    });

    if (response.ok) {
      //okuma  butonu ile okuma sayısını artır(okumalistesi)
      $readingListBtn.classList.add("active");
      $readingListNumber.textContent =
        Number($readingListNumber.textContent) + 1;
    }

    //401 oturum açmamış durumu elle al
    if (response.status == 401) {
      const $dialog = dialog({
        title: "Devam etmek için lütfen giriş yapınız",
        content:
          "Biz kodlayıcıların paylaşımda bulunduğu,güncel kaldığı ve kariyerlerini geliştirdiği bir yeriz",
      });
      document.body.appendChild($dialog);
    }
  } catch (error) {
    console.log("Okuma listesine eklenirken bir hatta oluştu", error.message);
  }
};

/**
 * @throws {Error}
 */
const removeFromReadingList = async () => {
  try {
    const response = await fetch(`${window.location}/readingList`, {
      method: "DELETE",
    });

    if (response.ok) {
      $readingListBtn.classList.remove("active");
      $readingListNumber.textContent =
        Number($readingListNumber.textContent) - 1;
    }
  } catch (error) {
    console.log(
      "Okuma listesi silme işlemi sırasında bir hatta oluştu",
      error.message
    );
  }
};

//Okuma olayı için olay dinleyicisi
$readingListBtn.addEventListener("click", async function () {
  $readingListBtn.setAttribute("disabled", "");
  if (!$readingListBtn.classList.contains("active")) {
    await addToReadingList();
  } else {
    await removeFromReadingList();
  }
  $readingListBtn.removeAttribute("disabled");
});
