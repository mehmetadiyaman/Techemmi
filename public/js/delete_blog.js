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

const $blogDeleteBtnAll = document.querySelectorAll("[data-blog-delete-btn]");

/**
 * Sunucu tarafında blog silme işlemleri
 * @async
 * @param {string} blogId
 * @returns {Promise<void>}
 */
const handleBlogDelete = async (blogId) => {
  // Modal gösterimi
  Modal({
    message: "Bu blogu silmek istediğinizden emin misiniz?",
    onConfirm: async () => {
      const response = await fetch(
        `${window.location.origin}/blogs/${blogId}/delete`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Snackbar({
          message: "Blog silindi",
          type: "success",
        });

        // 1 saniye sonra sayfayı yenile
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onCancel: () => {
      // İptal edildiğinde yapılacak işlemler (varsa)
    },
  });
};

//handleBlogDelete fonksiyonunu tetiklemek için tüm butonları dinler
$blogDeleteBtnAll.forEach(($deleteBtn) => {
  const blogId = $deleteBtn.dataset.blogDeleteBtn;
  $deleteBtn.addEventListener("click", handleBlogDelete.bind(null, blogId));
});
