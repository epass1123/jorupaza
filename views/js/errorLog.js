

$(document).ready(function() {
    $.ajax({
      url: "http://ceprj.gachon.ac.kr:60002/manage/errlog/all",
      method: "GET",
      complete: function(response) {
        console.log(response);
        if (response.status === 200) {
            const dataArray=response.responseJSON.err_logs
            const table = document.querySelector('table');
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML = '';
            dataArray.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.type}</td>
                    <td>${item.title}</td>
                    <td>${item.message}</td>
                    <td>${item.timestamp}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
          alert("로그아웃 실패");
          return;
        }
      }
    });
  });
