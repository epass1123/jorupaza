const itemsPerPage = 10; // 한 페이지당 표시할 항목 수
  let currentPage = 1; // 현재 페이지
  let dataArray; // 전체 데이터 배열

  function displayPage(dataArray) {
    alert(dataArray)
    const table = document.querySelector('table');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = dataArray.slice(startIndex, endIndex);

    currentData.forEach(item => {

      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${item.movieID}</td>
        <td>${item.title}</td>
        <td>${item.genre}</td>
        <td>${item.releaseDate}</td>
      `;
      tableBody.appendChild(row);
    });
  }


  function createPagination(dataArray) {
    const totalPages = Math.ceil(dataArray.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('page-item', 'page-link'); // 클래스 추가

      pageButton.innerText = i;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        displayPage(dataArray);
        createPagination(dataArray);
      });

      pagination.appendChild(pageButton);
    }
  }


function dataDownload(){
  var progress = document.querySelector(".loader");
  var requestImg=document.querySelector(".requestImg")
    progress.style.display = "block";
    requestImg.style.display="none"
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/mldata",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("성공")
            movieCSV()
            progress.style.display = "none";
            requestImg.style.display="block"
          }
          else{
            alert("실패")
            progress.style.display = "none";
            requestImg.style.display="block"
          }
        }
      });
}

function learningRequest(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ai",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function dataShare(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/reccontent",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("시작")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function learningStop(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ai",
        method: "DELETE",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("중지")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function shareStop(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/reccontent",
        method: "DELETE",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("중지")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function movieCSV(){
  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/admin/moviecsv/selectAll",
    method: "GET",
    complete: function(response) {
      console.log(response);
      if (response.status === 200) {
        var dataArray = response.responseJSON.movieCSV;
        currentPage = 1;
        displayPage(dataArray);
        createPagination(dataArray);
      }
      else{
        alert("실패")

      }
    }
  });
}
$(document).ready(function() {
  movieCSV()
})
