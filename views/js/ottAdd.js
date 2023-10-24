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
        url: "http://ceprj.gachon.ac.kr:60002/manage/ott/add",
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