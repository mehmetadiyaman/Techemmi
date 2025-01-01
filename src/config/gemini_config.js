/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini API yapılandırması
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini modeli için yapılandırma
const modelConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Sohbet modeli oluşturma
const getGeminiChat = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  return model.startChat({
    generationConfig: modelConfig,
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  });
};

module.exports = { getGeminiChat }; 