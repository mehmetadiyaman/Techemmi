/**
 * @license MIT
 * @copyright 2024 EMMİ
 */
"use strict";

/**
 * node modüller
 */
const express = require("express");


/**
 * ilk ekspres
 */
const app = express(); // Express uygulamasını önce oluştur



app.listen(3000, () => {
  console.log(`Servis Dinleme Portu http://localhost:3000`);
 
});


