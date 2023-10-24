function openPopup(event) {
    const popup = document.querySelector('.popup-container');
    popup.style.display = 'block';
    var row = event.target.closest('tr'); 
    var rowData = row.getElementsByTagName('td'); 

    document.getElementById('popupTitleInput').value = rowData[0].textContent;
    document.getElementById('popupRawTitleInput').value = rowData[1].textContent;
    document.getElementById('popupContentIdInput').value = rowData[2].textContent;
    document.getElementById('popupOffersInput').value = rowData[3].textContent;
    document.getElementById('popupDisneyURLInput').value = rowData[6].textContent;
    document.getElementById('popupWavveURLInput').value = rowData[7].textContent;
    document.getElementById('popupWatchaURLInput').value = rowData[8].textContent;
    document.getElementById('popupCastsURLInput').value = rowData[9].textContent;
    document.getElementById('popupGenreInput').value = rowData[10].textContent;
    document.getElementById('popupJwimgInput').value = rowData[11].textContent;
    document.getElementById('popupDirectorInput').value = rowData[12].textContent;
    console.log(rowData)
    for(var i=0; i<rowData.length; i++){
        console.log("rowData"+[i]+":"+rowData[i].textContent)
    }
}

// 팝업 닫기
function closePopup() {
    const popup = document.querySelector('.popup-container');
    popup.style.display = 'none';
}

// // 닫기 버튼 클릭 이벤트 처리
// const closeButton = document.querySelector('.close-button');
// closeButton.addEventListener('click', closePopup);

function popupEdit(){
    const title = document.querySelector("#popupTitleInput").value;
    const rawtitle=document.querySelector("#popupRawTitleInput").value;
    const contentid=document.querySelector("#popupContentIdInput").value;
    const Offers=document.querySelector("#popupOffersInput").value;
    const disneyURL=document.querySelector("#popupDisneyURLInput").value;
    const wavveURL=document.querySelector("#popupWavveURLInput").value;
    const watchaURL=document.querySelector("#popupWatchaURLInput").value;
    const casts=document.querySelector("#popupCastsURLInput").value;
    const genre=document.querySelector("#popupGenreInput").value;
    const jwimg=document.querySelector("#popupJwimgInput").value;
    const director=document.querySelector("#popupDirectorInput").value;



    const data={
        title:title,
        rawtitle:rawtitle,
        contentsID:contentid,
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
        url: "http://ceprj.gachon.ac.kr:60002/manage/search",
        method: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("성공")
                closePopup()
            }
            else{
                alert("실패")
                return

            }
        }
    })
}


function search() {
    const input = document.querySelector(".contentSearchInput").value;
    var search = {
        input:input,
        option:"title"
    };

    var search2 = {
        input:input,
        option:"rawtitle"
    };

    

    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/manage/search",
        method: "POST",
        data: JSON.stringify(search),
         contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                const dataArray=response.responseJSON.possible_match
                const table = document.querySelector('table');
                const tableBody = table.querySelector('tbody');
                tableBody.innerHTML = '';
                dataArray.forEach(item => {
                    const row = document.createElement('tr');
                    if(item.disneyURL!=null){
                        if (item.disneyURL.length > 20) {
                            item.disneyURL1 = item.disneyURL.slice(0, 15) + "......";
                        }
                    }
                    if(item.wavveURL!=null){
                        if (item.wavveURL.length > 20) {
                            item.wavveURL1 = item.wavveURL.slice(0, 15) + "......";
                        }
                    }
                    row.innerHTML = `
                        <td>${item.title}</td>
                        <td>${item.rawtitle}</td>
                        <td>${item.contentsID}</td>
                        <td>${item.Offers}</td>
                        <td>${item.disneyURL1}</td>
                        <td>${item.wavveURL1}</td>
                        <td style="display: none;">${item.disneyURL}</td>
                        <td style="display: none;">${item.wavveURL}</td>                      
                        <td style="display: none;">${item.watchaURL}</td>
                        <td style="display: none;">${item.casts}</td>
                        <td style="display: none;">${item.genre}</td>
                        <td style="display: none;">${item.jwimg}</td>
                        <td style="display: none;">${item.director}</td>

                        <td><button type="button" class="editBtn" onclick="openPopup(event);">수정</button></td>
                    `;
                    tableBody.appendChild(row);
                });
                $.ajax({
                    url: "http://ceprj.gachon.ac.kr:60002/manage/search",
                    method: "POST",
                    data: JSON.stringify(search2),
                     contentType: "application/json",
                    complete:function (response) {
                        console.log(response)
                        if (response.status === 200) {
                            const dataArray=response.responseJSON.possible_match
                            const table = document.querySelector('table');
                            const tableBody = table.querySelector('tbody');
                            dataArray.forEach(item => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${item.title}</td>
                                    <td>${item.rawtitle}</td>
                                    <td>${item.contentsID}</td>
                                    <td>${item.Offers}</td>
                                    <td>${item.disneyURL1}</td>
                                    <td>${item.wavveURL1}</td>
                                    <td style="display: none;">${item.disneyURL}</td>
                                    <td style="display: none;">${item.wavveURL}</td>                      
                                    <td style="display: none;">${item.watchaURL}</td>
                                    <td style="display: none;">${item.casts}</td>
                                    <td style="display: none;">${item.genre}</td>
                                    <td style="display: none;">${item.jwimg}</td>
                                    <td style="display: none;">${item.director}</td>
            
                                    <td><button type="button" class="editBtn" onclick="openPopup(event);">수정</button></td>
                                `;
                                tableBody.appendChild(row);
                            });
                            
                        }
                        else{
                            alert("실패")
                            return
            
                        }
                }
            });
            }
            else{
                alert("실패")
                return

            }
    }
});
}
// function handleEnterKey(event) {
//     if (event.key == "Enter") {
//         search()
//     }
// }


const inputElement = document.querySelector(".contentSearchInput");
inputElement.addEventListener("keyup", handleEnterKey);




