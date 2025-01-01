/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

class ChatWidget {
  constructor() {
    this.sessionId = Math.random().toString(36).substring(7);
    this.messages = [];
    this.isExpanded = false;
    this.isTyping = false;
    this.init();
  }

  init() {
    this.createWidgetHTML();
    this.addEventListeners();
    this.addMessage("Merhaba! Size nasıl yardımcı olabilirim?", "bot");
  }

  createWidgetHTML() {
    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chat-toggle-btn";
    toggleBtn.innerHTML = `
      <span class="material-symbols-rounded">chat</span>
    `;
    document.body.appendChild(toggleBtn);

    // Chat widget
    const widget = document.createElement("div");
    widget.className = "chat-widget";
    widget.innerHTML = `
      <div class="chat-header">
        <div>
          <div class="chat-header-title">EMMİ Asistan</div>
        </div>
        <span class="material-symbols-rounded">close</span>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input-container">
        <input 
          type="text" 
          class="chat-input" 
          placeholder="Mesajınızı yazın..."
          aria-label="Mesaj giriş alanı"
        >
        <button class="chat-send-btn" aria-label="Mesaj gönder">
          <span class="material-symbols-rounded">send</span>
        </button>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    this.widget = widget;
    this.toggleBtn = toggleBtn;
    this.messagesContainer = widget.querySelector(".chat-messages");
    this.input = widget.querySelector(".chat-input");
    this.sendButton = widget.querySelector(".chat-send-btn");
  }

  addEventListeners() {
    // Toggle button tıklama
    this.toggleBtn.addEventListener("click", () => {
      this.toggleExpand();
      // Toggle button'u gizle
      this.toggleBtn.style.display = 'none';
    });

    // Header close button tıklama
    this.widget.querySelector(".chat-header .material-symbols-rounded").addEventListener("click", () => {
      this.toggleExpand();
      // Toggle button'u göster
      this.toggleBtn.style.display = 'grid';
    });

    this.sendButton.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.widget.classList.toggle("expanded", this.isExpanded);
    
    if (this.isExpanded) {
      setTimeout(() => this.input.focus(), 500);
    }
  }

  addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `chat-message ${type}`;
    message.textContent = text;
    
    this.messagesContainer.appendChild(message);
    this.scrollToBottom();
    this.messages.push({ text, type });
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message || this.isTyping || message.length > 500) {
      if (message.length > 500) {
        this.addMessage("Mesaj çok uzun. Lütfen daha kısa bir mesaj yazın.", "bot");
      }
      return;
    }
    
    this.addMessage(message, "user");
    this.input.value = "";
    this.showTypingIndicator();
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: this.sessionId }),
      });
      
      if (!response.ok) throw new Error('API yanıt vermedi');
      
      const data = await response.json();
      this.hideTypingIndicator();
      
      if (data.success) {
        this.addMessage(data.message, "bot");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Chat error:", error);
      this.hideTypingIndicator();
      this.addMessage("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.", "bot");
    }
  }

  showTypingIndicator() {
    this.isTyping = true;
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = this.messagesContainer.querySelector(".typing-indicator");
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

window.addEventListener("load", () => new ChatWidget()); 