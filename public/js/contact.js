/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    
    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        showNotification('success', result.message);
        contactForm.reset();
      } else {
        showNotification('error', result.message);
      }

    } catch (error) {
      console.error('Contact error:', error);
      showNotification('error', 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      submitBtn.classList.remove('loading');
    }
  });
});

function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="material-symbols-rounded">
      ${type === 'success' ? 'check_circle' : 'error'}
    </span>
    <p class="body-medium">${message}</p>
  `;
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
} 