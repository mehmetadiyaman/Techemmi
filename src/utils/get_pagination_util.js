/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";

/**
 * özel modüller
 */

/**
 *verilen isteğe göre toplam blog sayısına göre sayfalamdırma nesnesi oluştur
 * @param {object} reqParams
 * @param {number} limit
 * @throws {number} totalBlogs
 * @returns {object}
 */
const getPagination = (currentRoute, reqParams, limit, totalBlogs) => {
  const currentPage = Number(reqParams.pageNumber) || 1;
  const skip = limit * (currentPage - 1);
  const totalPage = Math.ceil(totalBlogs / limit);
  const paginationObj = {
    next:
      totalBlogs > currentPage * limit
        ? `${currentRoute}page/${currentPage + 1}`
        : null,
    prev:
      skip && currentPage <= totalPage
        ? `${currentRoute}page/${currentPage - 1}`
        : null,
    totalPage,
    currentPage,
    skip,
    limit,
  };
  return paginationObj;
};
module.exports = getPagination;
