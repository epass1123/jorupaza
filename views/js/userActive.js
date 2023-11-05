

  $(function() {
    $("#datepicker").datepicker();
  });

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
        const dataArray=response.responseJSON.user_behavior
              const table = document.querySelector('table');
              const tableBody = table.querySelector('tbody');
              tableBody.innerHTML = '';
              dataArray.forEach(item => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td class="th1">${item.logID}</td>
                      <td class="th2">${item.userID}</td>
                      <td class="th3">${item.event_type}</td>
                      <td class="th4">${item.event_target}</td>
                      <td class="th5">${item.timestamp}</td>
                  `;
                  tableBody.appendChild(row);
                })
      } else {
          alert("불러오기 실패")
        return;
      }
    }
  });
}