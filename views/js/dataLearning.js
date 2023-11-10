var rowD = new Array();
var tdArr = new Array();

const itemsPerPage = 10; // 한 페이지당 표시할 항목 수
  let currentPage = 1; // 현재 페이지
  let dataArray; // 전체 데이터 배열

  function displayPage(dataArray) {
    const table = document.querySelector('table');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = dataArray.slice(startIndex, endIndex);

    currentData.forEach(item => {

      const row = document.createElement('tr');
      row.innerHTML = `
      <td><input type="checkbox" name="CheckBox" onclick="check(); uncheck()"></td>
      <td>${item.movieID}</td>
        <td>${item.title}</td>
        <td>${item.genre}</td>
        <td>${item.releaseDate}</td>
      `;
      tableBody.appendChild(row);
    });
  }


  function createPagination(dataArray) {
    totalPages = Math.ceil(dataArray.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    function displayPagesInGroup(group) {
      const startIndex = (group - 1) * 10 + 1;
      const endIndex = Math.min(group * 10, totalPages);
  
      for (let i = startIndex; i <= endIndex; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-item', 'page-link');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
          currentPage = i;
          displayPage(dataArray);
          createPagination(dataArray);
        });
        pagination.appendChild(pageButton);
      }
    }
  
    // Previous Group Button
    const prevGroupButton = document.createElement('button');
    prevGroupButton.classList.add('page-item', 'page-link');
    prevGroupButton.innerText = 'Previous';
    prevGroupButton.addEventListener('click', () => {
      if (currentPage > 1) {
        const currentGroup = Math.ceil(currentPage / 10);
        currentPage = (currentGroup - 1) * 10;
        displayPage(dataArray);
        createPagination(dataArray);
      }
    });
  
    if (currentPage <= 10) {
      prevGroupButton.style.display = 'none'; // 현재 페이지가 첫 10개 페이지에 있는 경우 "Previous" 버튼 숨김
    }
  
    pagination.appendChild(prevGroupButton);
  
    displayPagesInGroup(Math.ceil(currentPage / 10));
  
    // Next Group Button
    const nextGroupButton = document.createElement('button');
    nextGroupButton.classList.add('page-item', 'page-link');
    nextGroupButton.innerText = 'Next';
    nextGroupButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        const currentGroup = Math.ceil(currentPage / 10);
        currentPage = currentGroup * 10 + 1;
        displayPage(dataArray);
        createPagination(dataArray);
      }
    });
    pagination.appendChild(nextGroupButton);
  }


function dataDownload(){
  var progress = document.querySelector(".loader1");
  var requestImg=document.querySelector(".requestImg1")
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
  var progress = document.querySelector(".loader2");
  var requestImg=document.querySelector(".requestImg2")
  progress.style.display = "block";
  requestImg.style.display="none"
  var data = {
    "movieID": tdArr
  };
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ai",
        method: "POST",
        data: JSON.stringify(data), 
        contentType: 'application/json', 
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
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
window.onload=function(){
    // 서버 socket 접속용 객체 생성 및 연결
  const socket = io.connect("http://ceprj.gachon.ac.kr:60002", {path: "/socket.io", transports: ['websocket']});
  // # 연결(connect) 이벤트 처리
  socket.on('connect', ()=>{
      console.log('연결 성공');
  });
  // # 연결 해제(disconnect) 이벤트 처리
  socket.on('disconnect', (reason)=>{
      console.log(reason);
      console.log('연결 종료');
  });
  // # 에러 발생(error) 이벤트 처리
  socket.on('error', (error)=>{
      console.log(`에러 발생: ${error}`);
  });
  // # 서버가 보낸 "사용자정의 이벤트" 처리: 매개변수로 들어온 데이터를 받아서 처리한다.
  socket.on('fileUpdate', (data)=>{
      console.log(`서버에게 받은 메시지: ${data}`);
  });
}

function learningProcess(){
  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/admin/aiprocess",
    method: "GET",
    complete: function(response) {
      console.log(response);
      if (response.status === 200) {
        alert("성공")
      }
      else{
        alert("실패")
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
        dataArray = response.responseJSON.moviecsv;
        console.log(response.responseJSON.moviecsv)
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

function check() {
  var checkboxes = $("input[name=CheckBox]:checked");

  checkboxes.each(function (i) {
      var tr = checkboxes.eq(i).closest('tr');
      var td = tr.children();
      var userId = td.eq(1).text();

      if (!tdArr.includes(userId)) {
          tdArr.push(userId); // 체크된 항목을 배열에 추가
      }

      console.log(tdArr);
  });
}

function uncheck() {
  var checkboxes = $("input[name=CheckBox]:not(:checked)");

  checkboxes.each(function (i) {
      var tr = checkboxes.eq(i).closest('tr');
      var td = tr.children();
      var userId = td.eq(1).text();
      var index = tdArr.indexOf(userId);

      if (index !== -1) {
          tdArr.splice(index, 1); // 언체크된 항목을 배열에서 제거
      }

      console.log(tdArr);
  });
}
$(document).ready(function() {
  movieCSV()
})

function search() {
  const input = document.querySelector("#Inputs").value;
  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/admin/moviecsv/" + input,
    method: "GET",
    complete: function(response) {
      if (response.status === 200) {
        dataArray = response.responseJSON.moviecsv;
        currentPage = 1;
        displayPage(dataArray);
        createPagination(dataArray);
      } else {
        return
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  const img1Container = document.querySelector('.requestImg1');
  const text1Container = document.querySelector('.explainText1');

  img1Container.addEventListener('mouseover', () => {
      text1Container.style.display = 'block';
  });

  img1Container.addEventListener('mouseout', () => {
      text1Container.style.display = 'none';
  });

  const img2Container = document.querySelector('.requestImg2');
  const text2Container = document.querySelector('.explainText2');

  img2Container.addEventListener('mouseover', () => {
      text2Container.style.display = 'block';
  });

  img2Container.addEventListener('mouseout', () => {
      text2Container.style.display = 'none';
  });

  const img3Container = document.querySelector('.requestImg3');
  const text3Container = document.querySelector('.explainText3');

  img3Container.addEventListener('mouseover', () => {
      text3Container.style.display = 'block';
  });

  img3Container.addEventListener('mouseout', () => {
      text3Container.style.display = 'none';
  });

  // 다른 이미지에 대한 이벤트도 추가해주면 돼.
});