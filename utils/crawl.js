import axios from "axios";
import cheerio from "cheerio";

function getDisneyPlusLink(h,bool) {
    return new Promise((resolve, reject) => {
      axios.get(h)
        .then(response => {
            let link =""
            if(bool){
                link = response.request.res.responseUrl.split('?')[0];

            }
            else{
                link = response.request.res.responseUrl;

            }
          resolve(link);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function crawlData(URL) {
    return new Promise((resolve, reject) => {
      axios.get(URL)
        .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);
  
          const titlebox = $('.title-block');
          let title = "";
          let rawtitle = "";
          if (titlebox.length > 0) {
            title = titlebox.find('h1').text();
            rawtitle = titlebox.find('h3').text().replace("원제: ", '').trim();
          }
  
          const specifics = $('.detail-infos');
          let details = "";
          if (specifics.length > 0) {
            const cutoff = specifics.length / 2;
            specifics.slice(0, cutoff).each((index, element) => {
              const t = $(element).find('h3').text();
              const c = $(element).find('.detail-infos__value').text().trim().replace(', ',',');
              details += `${t}:${c}|`;
            });
            details = details.slice(0, -1);
          }
  
          const synopsisbox = $('p.text-wrap-pre-line.mt-0 span');
          let synopsistext = "";
          if (synopsisbox.length > 0) {
            synopsistext = synopsisbox.text().replace('\n', '');
          }
  
          const creditsActors = $('.title-credits__actor span.title-credit-name');
          let actors = "";
          if (creditsActors.length > 0) {
            creditsActors.each((index, element) => {
              actors += $(element).text().trim() + ',';
            });
            actors = actors.slice(0, -1);
          }

          const imgBox = $('.picture-comp.title-poster__image');
          let imgSrc = "";
          if (imgBox.length > 0) {
            imgSrc = imgBox.find('source').attr('data-srcset').split(',')[0];
          }

          const offerLinks = $('a.offer');
          let offers = "";
          let hrefs = "";
  
          if (offerLinks.length > 0) {
            const linkPromises = [];
            for (let i = 0; i < offerLinks.length; i++) {
              const element = offerLinks[i];
              const platform = $(element).find('img.offer__icon').attr('alt');
              const h = $(element).attr('href');
              if (!offers.includes(platform)) {
                offers += platform + ',';
                if (platform === "Disney Plus") {
                  linkPromises.push(getDisneyPlusLink(h,true));
                } else {
                    linkPromises.push(getDisneyPlusLink(h,false));

                }
              }
            }
            Promise.all(linkPromises)
              .then(links => {
                hrefs += links.join(',') + ',';
                offers = offers.slice(0, -1);
                hrefs = hrefs.slice(0, -1);
                const result = {
                  title: title,
                  rawtitle: rawtitle,
                  synopsistext: synopsistext,
                  actors: actors,
                  jwURL:URL,
                  imgSrc: imgSrc,
                  offers: offers,
                  hrefs: hrefs,
                  details: details,
                };
                resolve(result);
              })
              .catch(error => {
                reject('링크 가져오기 중 오류 발생: ' + error.message);
              });
          } else {
            const result = {
              title: title,
              rawtitle: rawtitle,
              synopsistext: synopsistext,
              actors: actors,
              jwURL:URL,
              imgSrc: imgSrc,
              offers: offers,
              hrefs: hrefs,
              details: details,
            };
            resolve(result);
          }
        })
        .catch(error => {
          reject('스크래핑 중 오류 발생: ' + error.message);
        });
    });
  }

export{crawlData}