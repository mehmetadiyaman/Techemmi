import json
import re
import time
import requests
import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from gridfs import GridFS

# .env dosyasını yükle
load_dotenv()

def setup_driver():
    """WebDriver'ı ayarlayın."""
    driver = webdriver.Chrome()
    return driver

def setup_database():
    """MongoDB Atlas bağlantısını ayarlayın ve Emmi veritabanını seçin."""
    try:
        connection_uri = os.getenv('MONGO_CONNECTION_URI')
        client = MongoClient(connection_uri)
        # Bağlantıyı test et
        client.admin.command('ping')
        print("MongoDB Atlas'a başarıyla bağlandı!")
        
        db = client['Emmi']
        collection = db['news']
        return db, collection
    except Exception as e:
        print(f"MongoDB Atlas bağlantı hatası: {e}")
        raise

def setup_gridfs(db):
    """GridFS ayarlarını yap."""
    return GridFS(db)

def download_image(image_url):
    """URL'den görseli indir ve binary olarak döndür."""
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            return response.content
        else:
            print(f"Görsel indirilemedi. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Görsel indirilemedi: {image_url}, Hata: {e}")
        return None

def save_image_to_gridfs(fs, image_data, filename):
    """Görseli GridFS'e kaydet."""
    try:
        if image_data:
            return fs.put(image_data, filename=filename)
        return None
    except Exception as e:
        print(f"Görsel kaydedilemedi: {filename}, Hata: {e}")
        return None

def extract_image_url(article):
    """Görsel URL'sini çıkarın."""
    try:
        image_element = article.find_element(By.CSS_SELECTOR, "figure.onizleme")
        image_url = image_element.value_of_css_property('background-image')
        match = re.search(r'url\((.*?)\)', image_url)
        return match.group(1).strip("'\"") if match else None
    except Exception as e:
        print(f"Görsel URL'si çıkarılamadı: {e}")
        return None

def extract_tags(article):
    """Tag'leri çıkarın."""
    try:
        tags_elements = article.find_elements(By.CSS_SELECTOR, "a.news-tag")
        return [tag.text for tag in tags_elements]
    except Exception as e:
        print(f"Tag'ler çıkarılamadı: {e}")
        return []

def extract_articles(driver, fs, category):
    """Sayfadaki makaleleri çıkarın ve bir listeye ekleyin."""
    articles_data = []
    try:
        articles = driver.find_elements(By.CSS_SELECTOR, "article.blogItem")
        
        for article in articles:
            try:
                title_element = article.find_element(By.CSS_SELECTOR, "h3 a.baslik")
                link = title_element.get_attribute("href")
                title = title_element.text
                image_url = extract_image_url(article)
                description = article.find_element(By.CSS_SELECTOR, ".aciklama").text
                tags = extract_tags(article)

                # Görseli indir ve GridFS'e kaydet
                image_data = download_image(image_url) if image_url else None
                image_id = save_image_to_gridfs(fs, image_data, f"{title}.jpg") if image_data else None
                
                articles_data.append({
                    "title": title,
                    "link": link,
                    "image_id": image_id,
                    "description": description,
                    "tags": tags,
                    "category": category,
                    "created_at": time.strftime('%Y-%m-%d %H:%M:%S')
                })
                
            except Exception as e:
                print(f"Makale çıkarılırken hata: {e}")
                continue

    except Exception as e:
        print(f"Makaleler çıkarılırken hata: {e}")
    
    return articles_data

def save_to_mongo(data, collection):
    """Veriyi MongoDB'ye kaydedin."""
    try:
        for article in data:
            if not collection.find_one({"link": article["link"]}):
                collection.insert_one(article)
                print(f"Yeni makale eklendi: {article['title']}")
    except Exception as e:
        print(f"MongoDB'ye kayıt hatası: {e}")

def main(urls_with_categories):
    """Ana fonksiyon. Birden fazla URL'yi ve kategoriyi işler."""
    driver = None
    try:
        driver = setup_driver()
        db, collection = setup_database()
        fs = setup_gridfs(db)

        for url, category in urls_with_categories:
            try:
                print(f"\n{category} kategorisi için {url} işleniyor...")
                
                # Sayfayı ziyaret et
                driver.get(f"{url}?sayfa=1")

                # Sayfa tamamen yüklenene kadar bekle
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "article.blogItem"))
                )

                # Makaleleri çıkar ve kaydet
                articles_data = extract_articles(driver, fs, category)
                if articles_data:
                    save_to_mongo(articles_data, collection)
                    print(f"{category} kategorisinde {len(articles_data)} makale işlendi.")
                else:
                    print(f"{category} kategorisinde makale bulunamadı.")

            except Exception as e:
                print(f"{category} kategorisi işlenirken hata: {e}")
                continue

    except Exception as e:
        print(f"Ana işlem hatası: {e}")
    
    finally:
        if driver:
            driver.quit()
            print("\nWebDriver kapatıldı.")

if __name__ == "__main__":
    URLS_WITH_CATEGORIES = [
        ("https://www.donanimhaber.com/yapay-zeka", "Yapay Zeka"),
        ("https://www.donanimhaber.com/oyunlar", "Oyunlar"),
        ("https://www.donanimhaber.com/siber-guvenlik", "Siber Güvenlik"),
        ("https://www.donanimhaber.com/web-siteleri", "Web Siteleri"),
        ("https://www.donanimhaber.com/sosyal-medya", "Sosyal Medya"),
        ("https://www.donanimhaber.com/blockchain", "Blockchain"),
    ]

    print("Haber toplama işlemi başlatılıyor...")
    main(URLS_WITH_CATEGORIES)
    print("İşlem tamamlandı.")
