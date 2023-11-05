function addClick(){
    const title = document.querySelector(".addTitle").value;
    const rawtitle = document.querySelector(".addRawtitle").value;
    const disneyURL = document.querySelector(".addDisneyURL").value;
    const wavveURL =  document.querySelector(".addWavveURL").value;
    const watchaURL= document.querySelector(".addWatchaURL").value;
    const casts = document.querySelector(".addCasts").value;
    const genre = document.querySelector(".addGenre").value;
    const jwimg = document.querySelector(".addJwimg").value;
    const Offers = document.querySelector(".addOffers").value;
    const director = document.querySelector(".addDirector").value;

    const data={
        title:title,
        rawtitle:rawtitle,
        Offers:Offers,
        disneyURL:disneyURL,
        wavveURL:wavveURL,
        watchaURL:watchaURL,
        casts:casts,
        genre:genre,
        jwimg:jwimg,
        director:director
    }
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ott",
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("성공")
                reload()
            }
            else{
                alert("실패")
                return

            }
        }
    })
}

function reload(){
    document.querySelector(".addTitle").value="";
    document.querySelector(".addRawtitle").value="";
    document.querySelector(".addDisneyURL").value="";
    document.querySelector(".addWavveURL").value="";
    document.querySelector(".addWatchaURL").value="";
    document.querySelector(".addCasts").value="";
    document.querySelector(".addGenre").value="";
    document.querySelector(".addJwimg").value="";
    document.querySelector(".addOffers").value="";
    document.querySelector(".addDirector").value="";
}

function crawling(){
    const url=document.querySelector("#crawlingInput").value;
    
    
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/jwcontent",
        method: "POST",
        data: JSON.stringify({url:url}),
        contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("성공했습니다")

                var splitArray = response.responseJSON.crawled_data.hrefs.split(",");
                for(var i=0; i<splitArray.length; i++){
                    if(splitArray[i].includes("disney")){
                        document.querySelector(".addDisneyURL").value=splitArray[i];
                    }
                    else if(splitArray[i].includes("wavve")){
                        document.querySelector(".addWavveURL").value=splitArray[i];
                    }
                    else if(splitArray[i].includes("watcha")){
                        document.querySelector(".addWatchaURL").value=splitArray[i];
                    }
                    
                }

                var detail = value=response.responseJSON.crawled_data.details.split("|");
                var detailsObject = {};
                for (var i = 0; i < detail.length; i++) {
                    var pair = detail[i].split(":");
                        var key = pair[0].trim(); 
                        var value = pair[1].trim();
                        detailsObject[key] = value;
                }

                if ("장르" in detailsObject) {
                    document.querySelector(".addGenre").value=detailsObject["장르"]
                } 
                if("감독" in detailsObject){
                    document.querySelector(".addDirector").value=detailsObject["감독"]
                }

                document.querySelector(".addTitle").value=response.responseJSON.crawled_data.title;
                document.querySelector(".addRawtitle").value=response.responseJSON.crawled_data.rawtitle;
                document.querySelector(".addCasts").value=response.responseJSON.crawled_data.actors;
                document.querySelector(".addJwimg").value=response.responseJSON.crawled_data.imgSrc;
                document.querySelector(".addOffers").value=response.responseJSON.crawled_data.offers;
            }
            else{
                alert("실패")
                return

            }
        }
    })
}