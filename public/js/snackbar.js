"use strict";

const $snackbarWrapper = document.querySelector("[data-snackbar-wrapper]");
let lastTimeout = null;

/**
 * Snackbar özelliklerini ve bileşenlerini oluşturma
 * @param {Object} props
 * @param {string} props.message
 * @param {string} [props.type]
 */
const Snackbar = (props) => {
  const $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar");
  props.type && $snackbar.classList.add(props.type);
  $snackbar.innerHTML = `<p class="body-medium snackbar-text">${props.message}</p>`;

  $snackbarWrapper.innerHTML = "";
  $snackbarWrapper.append($snackbar);

  clearTimeout(lastTimeout);
  lastTimeout = setTimeout(() => {
    $snackbar.style.animation = "slide-out 0.3s ease-in forwards";
    setTimeout(() => {
      $snackbarWrapper.removeChild($snackbar);
    }, 500);
  }, 2000);
};

/**
 * Modal özelliklerini ve bileşenlerini oluşturma
 * @param {Object} props
 * @param {string} props.message
 * @param {Function} props.onConfirm
 * @param {Function} props.onCancel
 */
const Modal = (props) => {
  const $modalWrapper = document.createElement("div");
  $modalWrapper.classList.add("modal-wrapper");
  document.body.appendChild($modalWrapper);

  const $modal = document.createElement("div");
  $modal.classList.add("modal");
  $modal.innerHTML = `
    <div class="modal-content">
      <p class="body-medium">${props.message}</p>
      <div class="modal-buttons">
        <button id="confirm-btn">Evet</button>
        <button id="cancel-btn">Hayır</button>
      </div>
    </div>
  `;

  $modalWrapper.innerHTML = "";
  $modalWrapper.append($modal);
  $modalWrapper.classList.add("active");

  // Modal'ı kapatmak için dış alana tıklama olayı
  $modalWrapper.addEventListener("click", (e) => {
    if (e.target === $modalWrapper) {
      closeModal();
    }
  });

  $modal.querySelector("#confirm-btn").addEventListener("click", () => {
    props.onConfirm();
    closeModal();
  });

  $modal.querySelector("#cancel-btn").addEventListener("click", closeModal);

  function closeModal() {
    $modal.style.animation = "modal-slide-out 0.4s ease-out forwards";
    setTimeout(() => {
      $modalWrapper.classList.remove("active");
      $modalWrapper.innerHTML = "";
    }, 400);
  }
};

// Snackbar ve Modal fonksiyonunu dışa aktar
export default Snackbar;
export { Modal };
