/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";
/**
 * @async
 * @function countVisit
 * @throws {Error}
 */
const countVisit = async () => {
  try {
    //Ziyaret sayısını artır
    const response = await fetch(`${window.location}/visit`, { method: "PUT" });

    //

    if (response.ok) {
      visitedBlogs.push(window.location.pathname);
      localStorage.setItem("visitedBlogs", JSON.stringify(visitedBlogs));
    }
  } catch (error) {
    console.error("Ziyaret eden sayısında bir hata oluştu", error.message);
    throw error;
  }
};

//localSroreden ziyaret edilen blogları alma
let visitedBlogs = localStorage.getItem("visitedBlogs");

//İlk ziyaret edilenler bulnmama durumu
if (!visitedBlogs) localStorage.setItem("visitedBlogs", JSON.stringify([]));

//Ziyaret edilen bloğu pars et
visitedBlogs = JSON.parse(localStorage.getItem("visitedBlogs"));

//Eğer kullanıcı ilk defa ziyaret ettiyse countVisit fonksiyonunu çağırır
if (!visitedBlogs.includes(window.location.pathname)) {
  countVisit();
}
