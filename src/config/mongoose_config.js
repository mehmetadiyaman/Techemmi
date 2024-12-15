/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * Node modülleri
 */
const mongoose = require("mongoose");

/**
 * API yapılandırması
 * @type {ClientOptions}
 */
const ClientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: "Emmi",
};

/**
 * MongoDB veritabanına bağlanır
 * @param {string} connectionURI - MongoDB bağlantı URI'si
 * @returns {Promise<void>}
 * @throws {Error} - Bağlantı hatası
 */
const connectDB = async (connectionURI) => {
  try {
    await mongoose.connect(connectionURI, ClientOptions);
    // Atlas bağlantısını doğrulamak için
    console.log("Bağlantı URL'si:", mongoose.connection.host);
    console.log("MongoDB bağlandı");
  } catch (error) {
    console.error("MongoDB bağlanırken hata oluştu:", error.message);
    throw error;
  }
};

/**
 * MongoDB veritabanı bağlantısını keser
 * @async
 * @function disconnectDB
 * @throws {Error} - Bağlantı kesme hatası
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB bağlantısı kesildi");
  } catch (error) {
    console.error("Bağlantı kesilirken hata oluştu:", error.message);
    throw error; // Hata yönetimi
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
