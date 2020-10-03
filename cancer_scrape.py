#Import dependencies and setup
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time

#Function to intialize brower
def init_browser():
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)

#Function to scrape information 
def scrape():
    browser = init_browser()

    #####--Cancer News Site--#####
    url = "https://www.cancer.gov/news-events"
    browser.visit(url)

    time.sleep(1) #Allow page to load

    #Scrape page into Soup
    html = browser.html
    soup = bs(html, "html.parser")

    news_data = {}
    #Get the latest news title and text
    article = soup.find('div', class_= 'feature-card')
    news_data['article_title'] = article.find('h3').text
    
    news_data['article_text'] = article.find('p').text

    news_data['news_url'] = "https://www.cancer.gov" + article.find('a')['href']

    browser.find_by_css('div.image-hover').click()
        
    news_data['date'] = browser.find_by_css('time').text

    #Quit the browser after scraping
    browser.quit()

    #Return results
    return news_data