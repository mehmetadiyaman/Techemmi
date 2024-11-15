import json
import re
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient

def setup_driver():
    """WebDriver'ı ayarlayın."""
    driver = webdriver.Chrome()  
    return driver

def setup_database():
    """MongoDB bağlantısını ayarlayın ve Emmi veritabanını seçin."""
    client = MongoClient("mongodb://localhost:27017/")
    db = client['Emmi']  # "Emmi" veritabanını seçiyoruz
    collection = db['siber']  # "siber" koleksiyonunu seçiyoruz
    return collection

def extract_articles(driver):
    """Sayfadaki makaleleri çıkarın ve bir listeye ekleyin."""
    articles_data = []
    articles = driver.find_elements(By.CSS_SELECTOR, "article.blogItem")
    
    for article in articles:
        title_element = article.find_element(By.CSS_SELECTOR, "h3 a.baslik")
        link = title_element.get_attribute("href")
        title = title_element.text
        image_url = extract_image_url(article)
        description = article.find_element(By.CSS_SELECTOR, ".aciklama").text
        tags = extract_tags(article)

        articles_data.append({
            "title": title,
            "link": link,
            "image_url": image_url,
            "description": description,
            "tags": tags
        })

    return articles_data

def extract_image_url(article):
    """Görsel URL'sini çıkarın."""
    image_element = article.find_element(By.CSS_SELECTOR, "figure.onizleme")
    image_url = image_element.value_of_css_property('background-image')
    match = re.search(r'url\((.*?)\)', image_url)
    return match.group(1).strip("'\"") if match else None

def extract_tags(article):
    """Tag'leri çıkarın."""
    tags_elements = article.find_elements(By.CSS_SELECTOR, "a.news-tag")
    return [tag.text for tag in tags_elements]

def save_to_mongo(data, collection):
    """Veriyi MongoDB'ye kaydedin."""
    for article in data:
        if not collection.find_one({"link": article["link"]}):  # Aynı makale varsa eklemez
            collection.insert_one(article)

def main(base_url):
    """Ana fonksiyon - sadece ilk sayfayı kaydeder."""
    driver = setup_driver()
    collection = setup_database()
    
    # İlk sayfanın URL'sini oluştur
    url = f"{base_url}?sayfa=1"
    driver.get(url)

    # Sayfa tamamen yüklendiğinde makaleleri çıkarın
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "article.blogItem"))
    )
    
    articles_data = extract_articles(driver)
    save_to_mongo(articles_data, collection)

    driver.quit()

if __name__ == "__main__":
    BASE_URL = "https://www.donanimhaber.com/siber-guvenlik"  
    main(BASE_URL)
