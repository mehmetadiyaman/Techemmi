const { MongoClient, ObjectId } = require("mongodb");
const { GridFSBucket } = require("mongodb");
const getPagination = require("../utils/get_pagination_util");

const getNewsByCategory = async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_CONNECTION_URI);
    const db = client.db("Emmi");
    const collection = db.collection("news");

    // URL'den kategori parametresini al ve doğru formata çevir
    const categoryMapping = {
      "siber-guvenlik": "Siber Güvenlik",
      "yapay-zeka": "Yapay Zeka",
      oyun: "Oyunlar",
      blockchain: "Blockchain",
      "web-siteleri": "Web Siteleri",
      "sosyal-medya": "Sosyal Medya",
    };

    const urlCategory = req.params.category;
    const dbCategory = categoryMapping[urlCategory];

    if (!dbCategory) {
      return res.status(404).send("Kategori bulunamadı");
    }

    // Pagination için değişkenler
    const limit = 12;
    const totalBlogs = await collection.countDocuments({
      category: dbCategory,
    });

    // getPagination util'ini kullan
    const paginationObj = getPagination(
      `/${urlCategory}/`,
      { pageNumber: req.params.pageNumber || req.query.page || 1 },
      limit,
      totalBlogs
    );

    // Kategoriye göre haberleri getir
    const news = await collection
      .find({ category: dbCategory })
      .sort({ _id: -1 })
      .skip(paginationObj.skip)
      .limit(paginationObj.limit)
      .toArray();

    // Her haber için gerekli formatta veri hazırla
    const formattedBlogs = news.map((article) => ({
      _id: article._id,
      title: article.title,
      description: article.description,
      banner: {
        url: `/news/image/${article.image_id}`,
      },
      link: article.link,
    }));

    res.render("pages/news_category", {
      latestBlogs: formattedBlogs,
      title: dbCategory,
      route: `/${urlCategory}`,
      sessionUser: req.session.user,
      pagination: paginationObj,
    });

    await client.close();
  } catch (error) {
    res.status(500).send("Bir hata oluştu");
  }
};

const getImage = async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_CONNECTION_URI);
    const db = client.db("Emmi");
    const bucket = new GridFSBucket(db);

    const imageId = new ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(imageId);

    res.set("Content-Type", "image/jpeg");
    downloadStream.pipe(res);

    downloadStream.on("end", () => {
      client.close();
    });

    downloadStream.on("error", () => {
      res.status(404).send("Görsel bulunamadı");
      client.close();
    });
  } catch (error) {
    res.status(404).send("Görsel bulunamadı");
  }
};

module.exports = {
  getNewsByCategory,
  getImage,
};
