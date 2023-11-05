import requests
import urllib.request
from bs4 import BeautifulSoup as bs
import time

URL = "https://www.justwatch.com/kr/%EC%98%81%ED%99%94/ineogongju-2021"
# URL은 입력으로 받아주세요.
# 여기는 테스트를 위해 미리 지정해놨습니다.

'''
이하 if 문은 해당 요소가 없을 수도 있기 때문에 각각에 대해서 if문 처리를 했습니다.
'''

# html request
html = requests.get(URL)
soup = bs(html.text, 'html.parser')

# html selection 
# Title(KOR) , rawTitle
titlebox = soup.select_one('.title-block')
if titlebox:
    title = titlebox.select_one('h1').text
    rawtitle = titlebox.select_one('h3')
    if rawtitle : 
        rawtitle = rawtitle.text
        if "원제: " in rawtitle:    # 원제가 없는 경우도 있습니다.
            rawtitle = rawtitle.replace("원제: ", '')
            rawtitle = rawtitle.strip()

#details
#아래 항목 중 없는 항목도 있습니다. 그래서 구분상에 배열에서 맨 뒤로 빼놨습니다 ( 87번째 줄 ). 저번에 DB에 넣는 작업을 해보셔서 이해하실 거라 생각합니다. 
#장르 #재생시간 #PD_Country #감독 #평점 #연령 등급
specifics = soup.select('.detail-infos')
if specifics:
    cutoff = len(specifics) // 2
    specifics = specifics[:-cutoff]
    details = []
    for spec in specifics:
        t = spec.select_one('h3').text
        c = spec.select_one('.detail-infos__value').text
        c = c.strip()
        c = c.replace(', ',',')
        details.append(f'{t}:{c}')
details = '|'.join(details)

#synpsistext
#시놉시스
synopsisbox = soup.select_one('p.text-wrap-pre-line.mt-0')
if synopsisbox:
    synopsistext = synopsisbox.select_one('span').text
    synopsistext = synopsistext.replace('\n', '')       
        
#actors        
#출연진
creditsActors = soup.select('.title-credits__actor')
actors = []
if creditsActors:
    for actor in creditsActors:
        if actor.select_one('span.title-credit-name'):
            name = actor.select_one('span.title-credit-name').text
            name = name.strip()
            actors.append(name)
    actors = ','.join(actors)

#offers
offerLinks = soup.select('a.offer')
if offerLinks:
    offers = []
    hrefs = []
    for o in offerLinks:
        platform = o.select_one('img.offer__icon').attrs['alt']
        h = o.attrs['href']
        if platform not in offers: 
            offers.append(platform)
            hrefs.append(f'{title}|{rawtitle}|{platform}|{h}')
    offers = ','.join(offers)
    hrefs = '\n'.join(hrefs)

#jwImg
imgBox = soup.select_one('.picture-comp.title-poster__image')
if imgBox:
    imgSrc = imgBox.select_one('source').get('data-srcset')
    imgSrc = imgSrc.split(',')[0]

line = [title, str(rawtitle), synopsistext, str(actors), imgSrc, offers, details]
line = '|'.join(line)

print(line) # 출력은 없어도 상관없습니다.

