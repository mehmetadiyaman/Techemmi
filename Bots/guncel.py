from pymongo import MongoClient
import feedparser

# MongoDB bağlantısını kur
client = MongoClient("mongodb://localhost:27017/")
db = client['Emmi']
collection = db['guncel']

# RSS Feed URL'sini girin
rss_url = "https://www.donanimhaber.com/rss/tum/"
feed = feedparser.parse(rss_url)

# RSS verisini kaydet
for entry in feed.entries:
    # Aynı makale varsa eklememek için kontrol yap
    if not collection.find_one({"link": entry.link}):
        article = {
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "summary": entry.summary
        }
        collection.insert_one(article)
        print(f"Eklendi: {entry.title}")
    else:
        print(f"Zaten mevcut: {entry.title}")
