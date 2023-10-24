function search() {
    const input = document.querySelector(".contentSearchInput").value;
    var search = {
        input:input,
        option:"title"
    };

    

    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/manage/search",
        method: "POST",
        data: JSON.stringify(search),
        contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("성공")
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

function handleEnterKey(event) {
    if (event.key === "Enter") {
        search()
    }
}


const inputElement = document.querySelector(".contentSearchInput");
inputElement.addEventListener("keyup", handleEnterKey);

// 팝업 열기
function openPopup(event) {
    const popup = document.querySelector('.popup-container');
    popup.style.display = 'block';
    var row = event.target.closest('tr'); // 클릭된 버튼의 부모 행을 찾습니다
    var rowData = row.getElementsByTagName('td'); // 행 내의 모든 데이터 셀을 찾습니다

    // 데이터를 가져와서 팝업의 input 요소에 채웁니다
    document.getElementById('popupTitleInput').value = rowData[0].textContent;
    document.getElementById('popupRawTitleInput').value = rowData[1].textContent;
    document.getElementById('popupContentIdInput').value = rowData[2].textContent;
    document.getElementById('popupOffersInput').value = rowData[3].textContent;
    document.getElementById('popupDisneyURLInput').value = rowData[6].textContent;
    document.getElementById('popupWavveURLInput').value = rowData[7].textContent;
}


// 팝업 닫기
function closePopup() {
    const popup = document.querySelector('.popup-container');
    popup.style.display = 'none';
}

// 닫기 버튼 클릭 이벤트 처리
const closeButton = document.querySelector('.close-button');
closeButton.addEventListener('click', closePopup);

function popupEdit(){
    const title = document.querySelector("#popupTitleInput").value;
    const rawtitle=document.querySelector("#popupRawTitleInput").value;
    const contentid=document.querySelector("#popupContentIdInput").value;
    const Offers=document.querySelector("#popupOffersInput").value;
    const disneyURL=document.querySelector("#popupDisneyURLInput").value;
    const wavveURL=document.querySelector("#popupWavveURLInput").value;


    const data={
        title:title,
        rawtitle:rawtitle,
        contentid:contentid,
        Offers:Offers,
        disneyURL:disneyURL,
        wavveURL:wavveURL
    }
    alert(data)
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/manage/search",
        method: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("성공")
                
            }
        }
    })
}
    
    






