// src/controllers/category_controller.js

const Blog = require("../models/blog_model");

// Belirli bir kategoriye göre blogları getir
exports.getCategory = async (req, res) => {
  const categoryName = req.params.categoryName; // URL'den kategori adını al

  try {
    // Kategoriyi kullanarak blogları filtrele
    const blogs = await Blog.find({ category: categoryName });

    // Elde edilen veriyi sayfaya render et veya JSON olarak döndür
    res.render("categoryPage", { blogs, categoryName });
    // JSON döndürmek isterseniz: res.json({ blogs, category: categoryName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Bir hata oluştu");
  }
};
