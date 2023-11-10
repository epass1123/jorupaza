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
      <td class="th1">${item.logID}</td>
      <td class="th2">${item.userID}</td>
      <td class="th3">${item.event_type}</td>
      <td class="th4">${item.event_target}</td>
      <td class="th5">${item.timestamp}</td>
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


function userActiveClick(){
  var userid=document.querySelector("#userActiveInput").value
  var date = document.querySelector(".date").value
  var dateTime = new Date(date);
  var year = dateTime.getFullYear();  
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var start = year+"-"+month+"-"+day
  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/userinfo/userbehavior/"+userid+"/"+start,
    method: "GET",
    complete: function(response) {
      console.log(response);
      if (response.status === 200) {
        dataArray=response.responseJSON.user_behavior
        displayPage(dataArray);
        createPagination(dataArray);
      } else {
          alert("데이터가 없습니다.")
          alert(userid)
        return;
      }
    }
  });
}