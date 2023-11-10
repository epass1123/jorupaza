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
      var time = new Date(item.timestamp);
      var timestamp = `${time.getFullYear()}년${time.getMonth() + 1}월${time.getDate()}일${time.getHours()}시${time.getMinutes()}분`;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" name="CheckBox"></td>
        <td>${timestamp}</td>
        <td>${item.type}</td>
        <td>${item.title}</td>
        <td><span class="message">${item.message}</span></td>
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
$(document).ready(function() {

  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/admin/errlog/selectAll",
    method: "GET",
    complete: function(response) {
      if (response.status === 200) {
        dataArray = response.responseJSON.err_logs;
        dataArray = dataArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        displayPage(dataArray);
        createPagination(dataArray);
      } else {
        alert("실패");
        return;
      }
    }
  });
});

function search() {
  const input = document.querySelector("#searchInput").value;
  $.ajax({
    url: "http://ceprj.gachon.ac.kr:60002/admin/errlog/" + input,
    method: "GET",
    complete: function(response) {
      if (response.status === 200) {
        dataArray = response.responseJSON.err_logs;
        dataArray = dataArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        currentPage = 1;
        displayPage(dataArray);
        createPagination(dataArray);
      } else {
        window.location.reload();
      }
    }
  });
}