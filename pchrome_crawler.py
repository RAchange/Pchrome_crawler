# -*- encoding: utf8-*-
import requests
import re
import json
from bs4 import BeautifulSoup
import base64
from urllib import parse

# 加個 Header 看起來比較專業
user_agent = 'Mozillahtm/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
headers = {'User-Agent': user_agent,
        'server': 'PChome/1.0.4',
        'Referer': 'https://www.pcstore.com.tw'}

class PCrawler():
    def __init__(self, word):
        self.store_k_word = ""
        self.slt_k_option = 1
        self.word = word

    # 將 keyword 進行編碼轉換， str -> unicode -> byte
    def store_k_word_base64(self):
        u = parse.quote(self.word)
        ss = base64.b64encode(bytes(u, 'utf8'))
        self.store_k_word = ss.decode('utf8')
        with open('test.out', 'w') as fp:
            fp.write(self.store_k_word)

    
    def get_method(self, page):
        # 發 GET request 並開始爬蟲
        getURL = 'https://www.pcstore.com.tw/adm/psearch.htm?store_k_word='+self.store_k_word+'&slt_k_option='+str(page)
        res = requests.get(url=getURL, headers=headers) # 擷取到網頁原始碼
        res.encoding = 'big5'   # 防止中文亂碼
        soup = BeautifulSoup(res.text, 'html.parser')   # 將其轉換為 BeautifulSoup
        return soup

    def dumProducts(self, soup):
        links = []
        products = soup.find_all("div", class_="pic2t pic2t_bg")
        idx = 0;
        if len(products) == 0:
            print("Sorry, there is no result associated with your search.@_@")
        else:
            print("The following results:")
        for product in products:
            links.append(product.find('a').get("href")) # 應用於功能 3 
            idx = idx + 1
            print(str(idx)+'.) '+product.text)

        input("press \'enter\' to continue")
        print()

        return links

def usage():
    print()
    print("===============================================================")
    print("||   <Usage> Enter a fellowing choice number                 ||")
    print("===============================================================")
    print("||   1.) Input a new keyword you want to search              ||")
    print("||   2.) List the recommend keywords from your last input    ||")
    print("||   3.) Get more information from the last listed products  ||")
    print("||   4.) Re-list the last input                              ||")
    print("||   0.) Input \'0\' or \'end\' to end this program              ||")
    print("===============================================================")
    re = input("%%> ")
    print()

    if  re == "end":
        return 0
    else :
        return int(re)


if __name__ == "__main__":
    page = 1
    search_word = ""
    while True:
        choose = usage()
        if choose == 0:
            break 
        elif choose == 1: # search
            page = 1
            search_word = input("Input the keyword you want to search:")
            handle = PCrawler(search_word)
            handle.store_k_word_base64()
            soup = handle.get_method(page)
            handle.dumProducts(soup)
        elif choose == 2:   # 推薦其他關鍵字  
            if len(search_word) == 0:
                print("Please input a valid search world first.")
                continue
            print("If you want to know more keyword related to the last keyword,")
            print("We recommend you to search the following keywords.")
            res = requests.get("https://www.pcstore.com.tw/adm/opt/search_autoword.php?word="+search_word+"&slimit=10&hlimit=10")
            res.encoding = 'utf-8'

            idx = 0
            recommends = res.text.splitlines()[2:]
            for each in recommends:
                idx = idx + 1
                each = each.split(' ' or '\t' or '\r' or '\0' or '\b')
                print(str(idx) + '.) ' + each[-1])

            choice = int(input("Please enter a number you want to search (if not input \'0\') :"))
            if choice == 0:
                continue;
            page = 1 
            handle = PCrawler(recommends[choice+1]);
            handle.store_k_word_base64()
            soup = handle.get_method(page)
            handle.dumProducts(soup)
        elif choose == 3:   # 取得產品連結
            handle = PCrawler(search_word)
            handle.store_k_word_base64()
            soup = handle.get_method(page)
            links = handle.dumProducts(soup)
            choice = int(input("Please input the product you want to understand more (if not input \'0\') :"))
            if choice != 0:
                print("Via this link: ", links[choose-1])
                input("press \'enter\' to continue")
        elif choose == 4:   # 再印一次
            handle = PCrawler(search_word)
            handle.store_k_word_base64()
            soup = handle.get_method(page)
            handle.dumProducts(soup)
