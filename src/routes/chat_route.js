/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini API yapılandırması
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sohbet oturumu saklamak için Map
const chatSessions = new Map();

// Model konfigürasyonu - daha hızlı yanıt için ayarlar
const modelConfig = {
  generationConfig: {
    temperature: 0.6, // Daha düşük sıcaklık = daha tutarlı ve hızlı yanıtlar
    topK: 20,        // Daha yüksek = daha hızlı yanıt
    topP: 0.8,       // Daha düşük = daha hızlı yanıt
    maxOutputTokens: 1024, // Daha kısa yanıtlar için limit
    candidateCount: 1,     // Tek yanıt üret
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    }
  ]
};

// Ön tanımlı bağlam - her oturum için bir kez ayarlanır
const INITIAL_CONTEXT = `Sen EMMİ'nin hızlı ve yardımsever AI asistanısın. 
- Türkçe konuş ve nazik ol
- Kısa ve öz yanıtlar ver
- Teknik konularda yardımcı ol
- Blog yazımı konusunda öneriler sun`;

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Mesaj uzunluğu kontrolü
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Mesaj çok uzun. Lütfen daha kısa bir mesaj yazın."
      });
    }

    // Mevcut oturumu al veya yeni oluştur
    let chat = chatSessions.get(sessionId);
    if (!chat) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      chat = model.startChat(modelConfig);

      // İlk bağlamı ayarla ve yanıtı bekle
      await chat.sendMessage(INITIAL_CONTEXT);
      chatSessions.set(sessionId, chat);
    }

    // Yanıt almak için timeout ekle
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Yanıt zaman aşımına uğradı')), 15000);
    });

    // Gemini'den yanıt al (timeout ile)
    const result = await Promise.race([
      chat.sendMessage(message),
      timeoutPromise
    ]);

    const response = await result.response;
    
    res.json({
      success: true,
      message: response.text(),
    });

  } catch (error) {
    console.error("Chat error:", error);
    
    // Oturum hatası varsa oturumu temizle
    if (error.message.includes('session')) {
      chatSessions.delete(req.body.sessionId);
    }

    res.status(500).json({
      success: false,
      message: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin."
    });
  }
});

// Belirli aralıklarla eski oturumları temizle
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of chatSessions.entries()) {
    if (now - session.lastAccess > 30 * 60 * 1000) { // 30 dakika
      chatSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // 5 dakikada bir kontrol et

module.exports = router; 